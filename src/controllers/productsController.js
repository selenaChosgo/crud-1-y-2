const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeProducts = (data) => fs.writeFileSync(productsFilePath, JSON.stringify(data), "utf-8");

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		res.render('products', {
			products,
			toThousand
		});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		let productId = +req.params.id;
		let product = products.find(product => product.id === productId);

		res.render("detail", {
			product,
			toThousand,
		})
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		let lastId = 0;
		products.forEach(product => {
			if (product.id > lastId) {
				lastId = product.id;
			}
		});

		let newProduct = {
			...req.body,
			price: +req.body.price,
			discount: +req.body.discount,
			id: lastId + 1,
			image: req.file ? req.file.filename : "default-image.png",
		}

		products.push(newProduct);

		writeProducts(products);

		res.redirect("/products");
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		let productId = +req.params.id;
		let product = products.find(product => product.id === productId);

		res.render("product-edit-form", {
			product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		let productId = +req.params.id;

		products.forEach(product => {
			if (product.id === productId){
				product.name = req.body.name;
				product.price = +req.body.price;
				product.discount = +req.body.discount;
				product.category = req.body.category;
				product.description = req.body.description;
			}

			writeProducts(products);

			res.redirect("/products");
		});
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		let productId = +req.params.id;
		let productToDelete;

		products.forEach(product => {
			if (product.id === productId) {
				productToDelete = product.name;
				let productToDeleteIndex = products.indexOf(product);

				products.splice(productToDeleteIndex, 1);
			}
		});

		writeProducts(products);

		res.redirect("/products");
	}
};

module.exports = controller;