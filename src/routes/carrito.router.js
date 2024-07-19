import {Router} from "express";
const router = Router();
//import fs from "fs";
import path from "path";
const cartsFilePath = path.resolve("./src/data/carts.json");
const productsFilePath = path.resolve("./src/data/products.json");
import CartManager from "../dao/db/cartManager.db.js";
const cartManager = new CartManager(); // Lee y devuelve el contenido de carts.Json, el cual contiene los datos del carritconst getCarts = () =>	try		const data = fs.readFileSync(cartsFilePath, "utf-8"		return JSON.parse(data) || [	} catch (error)		console.error("Error en la lectura del archivo del carrito:", error		return [};

// Convierte un array de carritos en una cadena JSON y lo guarda en el archivo especificado por cartsFilePath.
// const saveCarts = (carts) => {
// 	try {
// 		fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
// 	} catch (error) {
// 		console.error("Error al guardar en el archivo del carrito:", error);
// 	}
// };

// Lee y devuelve el contenido de products.Json, el cual contiene los datos de los productos.
// const getProducts = () => {
// 	try {
// 		const data = fs.readFileSync(productsFilePath, "utf-8");
// 		return JSON.parse(data) || [];
// 	} catch (error) {
// 		console.error("Error reading products file:", error);
// 		return [];
// 	}
// };

//Rutas Carrito:
//Devuelve el listado de los carritos:
// router.get("/", (req, res) => {
// 	const {limit} = req.query;
// 	const carts = getCarts();

// 	if (limit) {
// 		res.json(carts.slice(0, limit));
// 	} else {
// 		res.json(carts);
// 	}
// });

// Crea un nuevo carrito:
router.post("/", async (req, res) => {
	try {
		const nuevoCarrito = await cartManager.crearCarrito();
		res.json(nuevoCarrito);
	} catch (error) {
		console.error("Error al crear un nuevo carrito.", error);
		res.status(500).json({error: "Error interno del servidor."});
	}
});
// 	const carts = getCarts();
// 	const id =
// 		(carts.length ? Math.max(...carts.map((c) => parseInt(c.id))) : 0) + 1;
// 	const newCart = {id: id.toString(), products: []};
// 	carts.push(newCart);
// 	saveCarts(carts);
// 	res.json({
// 		message: `El carrito con ID ${id}, fue creado con exito!`,
// 		newCart,
// 	});

// Retorna un carrito especifico por ID:
router.get("/:cid", async (req, res) => {
	const cartId = req.params.cid;
	try {
		const carrito = await cartManager.getCarritoById(cartId);
		res.json(carrito.products);
	} catch (error) {
		console.error("Error al obtener el carrito.", error);
		res.status(500).json({error: "Error interno del servidor."});
	}
});
// 	const carts = getCarts();
// 	const cart = carts.find((c) => c.id === req.params.cid);
// 	if (cart) {
// 		res.json(cart.products);
// 	} else {
// 		res.json({
// 			message: `El carrito ID: ${req.params.cid}, no fue encontrado.`,
// 		});
// 	}

// Agrega un producto a un carrito segun los IDs indicados:
router.post("/:cid/product/:pid", async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const quantity = req.body.quantity || 1;

	try {
		const actualizarCarrito = await cartManager.agregarProductoAlCarrito(
			cartId,
			productId,
			quantity
		);
		res.json(actualizarCarrito.products);
	} catch (error) {
		console.error("Error al agregar productos al carrito.", error);
		res.status(500).json({error: "Error interno del servidor."});
	}
});

// Elimina un producto de un carrito seleccionado:
router.delete("/:cid/product/:pid", async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;

	try {
		const carritoActualizado = await cartManager.eliminarProductoDelCarrito(
			cartId,
			productId
		);
		res.json({
			message: "Producto eliminado del carrito con exito.",
			products: carritoActualizado.products,
		});
	} catch (error) {
		console.error("Error al eliminar el producto del carrito", error);
		res.status(500).json({error: "Error interno del servidor."});
	}
});

export default router;
