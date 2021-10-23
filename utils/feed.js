import products from '../static/products.json'
import Product from '../models/Product';

async function feed() {
    try {
        await Product.deleteMany();
        const result = await Product.insertMany(products)
        console.log(result);
    } catch (e) {
        console.error(e);
    }
}

export default feed;
