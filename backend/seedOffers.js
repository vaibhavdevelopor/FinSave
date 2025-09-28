import admin from "firebase-admin";
import fs from "fs";

// Read the JSON file manually
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedOffers() {
  const offers = [
    { platform: "Paytm", title: "Get 10% Cashback on Mobile Recharge", link: "https://paytm.com/recharge" },
    { platform: "Amazon Pay", title: "Flat ₹200 Cashback on First Transaction", link: "https://amazon.in/amazonpay" },
    { platform: "CRED", title: "Win up to ₹500 cashback on bill payments", link: "https://cred.club" },
    { platform: "PhonePe", title: "₹50 cashback on first UPI payment", link: "https://phonepe.com" },
    { platform: "Google Pay", title: "Scratch card up to ₹100 on mobile recharge", link: "https://gpay.app" },
    { platform: "Flipkart", title: "Get 5% cashback with Axis Flipkart card", link: "https://flipkart.com" },
    { platform: "Swiggy", title: "₹100 off on orders above ₹299", link: "https://swiggy.com" },
    { platform: "Zomato", title: "Get 20% cashback on dining out", link: "https://zomato.com" },
    { platform: "Myntra", title: "Flat 10% off on clothing", link: "https://myntra.com" },
    { platform: "Ola", title: "₹75 cashback on first ride with Paytm", link: "https://ola.com" },
    { platform: "Uber", title: "Save 15% with Uber Wallet", link: "https://uber.com" },
    { platform: "Domino's", title: "Free garlic bread on orders above ₹399", link: "https://dominos.com" },
    { platform: "BigBasket", title: "₹150 cashback on groceries above ₹999", link: "https://bigbasket.com" },
    { platform: "JioMart", title: "5% cashback with ICICI card", link: "https://jiomart.com" },
    { platform: "Netflix", title: "Get ₹100 cashback on subscription via Paytm", link: "https://netflix.com" },
    { platform: "Hotstar", title: "Flat 10% off annual subscription", link: "https://hotstar.com" },
    { platform: "Spotify", title: "Free 1-month premium trial", link: "https://spotify.com" },
    { platform: "YouTube", title: "₹50 cashback on YouTube Premium", link: "https://youtube.com" },
    { platform: "Tata Neu", title: "Earn NeuCoins worth ₹200", link: "https://tataneu.com" },
    { platform: "BookMyShow", title: "Get ₹75 off on movie tickets", link: "https://bookmyshow.com" },
  ];

  for (const offer of offers) {
    await db.collection("offers").add({
      ...offer,
      createdAt: new Date(),
    });
  }

  console.log("✅ 20 offers seeded successfully!");
  process.exit(0);
}

seedOffers();
