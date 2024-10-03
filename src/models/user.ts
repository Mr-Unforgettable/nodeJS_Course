import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
});

userSchema.methods.addToCart = async function(product: any) {
    try {
        const cartProductIndex = this.cart.items.findIndex((cp: any) => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity,
            });
        }

        this.cart.items = updatedCartItems;

        // Save and return the updated user document
        return await this.save();
    } catch (error) {
        console.error(`Failed to add product to cart: ${error}`);
        throw error;
    }
};

// Method to remove a product from the cart
userSchema.methods.deleteCart = async function(productId: string) {
    try {
        const updatedCartItems = this.cart.items.filter((item: any) => {
            return !item._id.equals(productId);
        });

        this.cart.items = updatedCartItems;

        // Save and return the updated user document
        return await this.save();
    } catch (error) {
        console.error(`Failed to remove product from cart: ${error}`);
        throw error;
    }
};

// Method to clear the cart
userSchema.methods.clearCart = async function() {
    try {
        this.cart = { items: [] };
        // Save and return the updated user document
        return await this.save();
    } catch (error) {
        console.error(`Failed to clear the cart: ${error}`);
        throw error;
    }
};

export const User = mongoose.model("users", userSchema);
