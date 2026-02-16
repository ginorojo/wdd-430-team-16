const { MongoClient } = require('mongodb');

// URI from .env
const uri = "mongodb+srv://Vercel-Admin-wdd-430-team-16:nU8mfdlLw5Tnhzx6@wdd-430-team-16.hq42hex.mongodb.net/Handcrafted?retryWrites=true&w=majority";

async function repair() {
    console.log('🔗 Connecting to MongoDB...');
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        console.log('🔧 Repairing OrderItems...');
        const orderItems = db.collection('order_items');

        const itemResult = await orderItems.updateMany(
            {
                $or: [
                    { productTitle: { $exists: false } },
                    { productTitle: null },
                    { price: { $exists: false } },
                    { price: null }
                ]
            },
            [
                {
                    $set: {
                        productTitle: { $ifNull: ["$productTitle", "Producto sin título"] },
                        price: { $ifNull: ["$price", 0] },
                        productImage: { $ifNull: ["$productImage", null] }
                    }
                }
            ]
        );
        console.log(`✅ Fixed ${itemResult.modifiedCount} OrderItems.`);

        console.log('🔧 Repairing Orders...');
        const orders = db.collection('orders');
        const orderResult = await orders.updateMany(
            {
                $or: [
                    { shippingName: { $exists: false } },
                    { shippingName: null }
                ]
            },
            {
                $set: {
                    shippingName: "Usuario anterior",
                    shippingAddress: "N/A",
                    shippingCity: "N/A",
                    shippingPostal: "00000",
                    shippingCountry: "MX"
                }
            }
        );
        console.log(`✅ Fixed ${orderResult.modifiedCount} Orders.`);

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.close();
        console.log('🔌 Disconnected.');
    }
}

repair();
