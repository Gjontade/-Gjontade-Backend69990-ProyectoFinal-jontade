import CartModel from "../fs/data/cart.model.js";

class CartManager {
	// Crea un carrito:
	async crearCarrito() {
		try {
			const nuevoCarrito = new CartModel({products: []});
			await nuevoCarrito.save();
			return nuevoCarrito;
		} catch (error) {
			console.log("Error al eliminar el producto", error);
			throw error;
		}
	}

	// Busca un carrito por su ID:
	async getCarritoById(cartId) {
		try {
			const carrito = await CartModel.findById(cartId);

			if (!carrito) {
				throw new Error(`No existe un carrito con el ID ${cartId}`);
			}

			return carrito;
		} catch (error) {
			console.error("Error al obtener el carrito por ID.", error);
			throw error;
		}
	}

	// Agrega un producto al carrito. Si el producto ya existe, incrementa su cantidad:
	async agregarProductoAlCarrito(cartId, productId, quantity) {
		try {
			const carrito = await this.getCarritoById(cartId);
			const existeProducto = carrito.products.find(
				(item) => item.product.toString() === productId
			);

			if (existeProducto) {
				existeProducto.quantity += quantity;
			} else {
				carrito.products.push({product: productId, quantity});
			}

			// Marca la propiedad 'products' como modificada antes de guardar.
			carrito.markModified("products");
			await carrito.save();
			return carrito;
		} catch (error) {
			console.error("Error al agregar el producto al carrito.", error);
			throw error;
		}
	}

	// Elimina un producto de un carrito seleccionado:
	async eliminarProductoDelCarrito(cartId, productId) {
		try {
			const carrito = await this.getCarritoById(cartId);
			const productoIndex = carrito.products.findIndex(
				(item) => item.product.toString() === productId
			);

			if (productoIndex !== -1) {
				carrito.products.splice(productoIndex, 1);
				carrito.markModified("products");
				await carrito.save();
				return carrito;
			} else {
				throw new error("Producto no encontrado en el carrito.");
			}
		} catch (error) {
			console.log("Error al eliminar el producto del carrito.", error);
			throw error;
		}
	}
}

export default CartManager;
