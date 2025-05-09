"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareProducts = void 0;
const Database_1 = require("../../../Database");
const mongoose_1 = require("mongoose");
const genai_1 = require("@google/genai");
const isTVProduct = (product) => {
    return product.productOverview !== undefined;
};
const compareProducts = async (req, res, next) => {
    try {
        const productIds = req.body.productIds;
        if (!productIds || !Array.isArray(productIds)) {
            return res.status(400).json({ message: "productIds array is required." });
        }
        if (productIds.length === 0 || productIds.length > 3) {
            return res
                .status(400)
                .json({ message: "Please provide between 1 and 3 product IDs only." });
        }
        // تأكد انهم valid ObjectIds
        const validIds = productIds.every((id) => mongoose_1.Types.ObjectId.isValid(id));
        if (!validIds) {
            return res
                .status(400)
                .json({ message: "Invalid product ID(s) provided." });
        }
        // هات المنتجات من الداتابيز بناءً على الكاتيجوري
        let products;
        const category = req.body.category;
        if (category === "Mobile") {
            products = await Database_1.Mobile.find({
                _id: { $in: productIds },
                category: "Mobile",
            }).lean();
        }
        else if (category === "Tablet") {
            products = await Database_1.Tablet.find({
                _id: { $in: productIds },
                category: "Tablet",
            }).lean();
        }
        else if (category === "Laptop") {
            products = await Database_1.Laptop.find({
                _id: { $in: productIds },
                category: "Laptop",
            }).lean();
        }
        else if (category === "Television") {
            products = await Database_1.Tv.find({
                _id: { $in: productIds },
                category: "Television",
            }).exec();
        }
        else {
            return res.status(400).json({
                message: "Invalid category. Only 'Mobile', 'Tablet', 'Laptop', or 'Television' are allowed.",
            });
        }
        if (products.length !== productIds.length) {
            return res.status(404).json({ message: "Some products not found." });
        }
        // تأكد إن كل المنتجات من نفس الكاتيجوري
        const uniqueCategories = new Set(products.map((p) => p.category));
        if (uniqueCategories.size > 1) {
            return res
                .status(400)
                .json({ message: "All products must belong to the same category." });
        }
        // attributes الخاصة بكل فئة
        const mobileAttributes = [
            "Operating System",
            "Shipping Dimensions",
            "Batteries",
            "Item Model Number",
            "Connectivity Technology",
            "GPS",
            "Display Colors",
            "Other Display Features",
            "Scanner Resolution",
            "Audio Jack",
            "Form Factor",
            "Color",
            "Battery Power Rating",
            "Item Weight",
            "Operating System",
            "Installed RAM",
            "Memory Storage Capacity",
            "Screen Size",
            "Resolution",
            "Refresh Rate",
            "Model Name",
            "Wireless Carrier",
            "Connector Type",
            "Included Components",
            "Form Factor",
            "Model Name",
            "Storage Capacity",
            "Wireless Carrier",
            "Color",
            "Battery Capacity",
            "Camera Features",
            "Special Features",
            "CPU Speed",
            "CPU Model",
            "Installed RAM",
            "Cellular Technology",
        ];
        const tabletAttributes = [
            "Return Reason / Return Period / Return Policy",
            "Brand",
            "Package Dimensions",
            "Item Model Number",
            "Manufacturer",
            "Series",
            "Color",
            "Display Size",
            "Screen Resolution",
            "Display Resolution",
            "Processor Brand",
            "Maximum Supported Memory",
            "Speaker Description",
            "Graphics Coprocessor",
            "Graphics Chipset Brand",
            "Graphics Card Description",
            "Connectivity Type",
            "Wireless Type",
            "Front Webcam Resolution",
            "Operating System",
            "Battery Charging Time (hours)",
            "Item Weight",
            "Screen Size",
            "Model Name",
            "Memory Storage Capacity",
            "Maximum Display Resolution",
            "Installed RAM",
            "Generation",
            "Special Features",
            "Display Technology",
            "Resolution",
            "Refresh Rate",
            "Included Components",
        ];
        const laptopAttributes = [
            "RAM Size",
            "Processor Brand",
            "Processor Type",
            "Processor Speed",
            "Graphics Coprocessor",
            "Graphics Card Description",
            "Graphics RAM Size",
            "Display Screen Size",
            "Screen Resolution",
            "Average Battery Life (in hours)",
            "Brand",
            "Package Dimensions",
            "Batteries",
            "Item Model Number",
            "Manufacturer",
            "Series",
            "Color",
            "Form Factor",
            "Display Clarity",
            "Number of Processors",
            "Memory Technology",
            "Computer Memory Type",
            "Maximum Supported Memory",
            "Hard Drive Size",
            "Hard Drive Description",
            "Hard Drive Interface",
            "Audio Details",
            "Graphics Chipset Brand",
            "Graphics RAM Type",
            "Graphics Card Interface",
            "Number of USB 3.0 Ports",
            "Number of HDMI Ports",
            "Voltage",
            "Optical Drive Type",
            "Operating System",
            "Are Batteries Included",
            "Lithium Battery Energy Content",
            "Lithium Battery Packaging",
            "Number of Lithium Ion Cells",
            "Item Weight",
            "Model Name",
            "Screen Size",
            "Hard Disk Size",
            "CPU Model",
            "Installed RAM",
            "Special Features",
            "Graphics Description",
            "Graphics Processor",
            "Installed RAM Memory",
            "Screen Size",
        ];
        const tvAttributes = [
            "Screen Size",
            "Display Technology",
            "Resolution",
            "Refresh Rate",
            "Special Features",
            "Included Components",
            "Connectivity Technology",
            "Aspect Ratio",
            "Product Dimensions (D x W x H)",
        ];
        const importantKeys = {};
        // تحديد الـ attributes بناءً على الكاتيجوري
        if (category === "Mobile") {
            mobileAttributes.forEach((key) => {
                importantKeys[key] = key.replace(/\s+/g, "").toLowerCase();
            });
        }
        if (category === "Tablet") {
            tabletAttributes.forEach((key) => {
                importantKeys[key] = key.replace(/\s+/g, "").toLowerCase();
            });
        }
        if (category === "Laptop") {
            laptopAttributes.forEach((key) => {
                importantKeys[key] = key.replace(/\s+/g, "").toLowerCase();
            });
        }
        if (category === "Television") {
            tvAttributes.forEach((key) => {
                importantKeys[key] = key.replace(/\s+/g, "").toLowerCase();
            });
        }
        const comparisonData = products.map((product) => {
            const extracted = {};
            // Check if attributes are defined before accessing
            if (product.attributes) {
                product.attributes.forEach((attr) => {
                    if (importantKeys[attr.key] &&
                        attr.value &&
                        attr.value.trim() !== "") {
                        const mappedKey = importantKeys[attr.key];
                        extracted[mappedKey] = attr.value;
                    }
                });
            }
            if (product.productOverview) {
                product.productOverview.forEach((attr) => {
                    if (importantKeys[attr.key] &&
                        attr.value &&
                        attr.value.trim() !== "") {
                        const mappedKey = importantKeys[attr.key];
                        extracted[mappedKey] = attr.value;
                    }
                });
            }
            return {
                id: String(product._id),
                title: product.title,
                priceAmazon: product.priceAmazon,
                priceJumia: product.priceJumia,
                priceNoon: product.priceNoon,
                thumbnailImage: product.thumbnailImage,
                ...extracted,
            };
        });
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_GEMINI });
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    parts: [
                        {
                            text: `
    You are an expert in device comparison.
    I will send you specs of multiple devices (TVs, laptops, monitors, mobiles, tablets, etc.) in the following JSON format:
    
    ${JSON.stringify(comparisonData, null, 2)}
    
    Rules:
    - You must compare strictly based on the following attributes (even if missing):
      
    Mobile Attributes:
    ${mobileAttributes.map((attr) => `- ${attr}`).join("\n")}
    
    Tablet Attributes:
    ${tabletAttributes.map((attr) => `- ${attr}`).join("\n")}
    
    Laptop Attributes:
    ${laptopAttributes.map((attr) => `- ${attr}`).join("\n")}
    
    TV Attributes:
    ${tvAttributes.map((attr) => `- ${attr}`).join("\n")}
    Price Attributes:
- priceAmazon
- priceJumia
- priceNoon
    - For price attributes, the lower the price the better. Assign “1” to the device(s) with the lowest price on each platform, and “0” to the rest.
    - Use each object’s “id” as the key in "comparisonTable".
    - For each attribute, assign “1” to the device(s) that are best for that attribute, and “0” to the others.
    - If more than one device ties, assign “1” to each.
    - If an attribute is missing for a device, consider it the weakest for that attribute.
    - After comparing all features, give each device a score from 1 to 10 in the "rating" array (performance first, then price).
    - Output strictly only the JSON in the given structure. No extra comments or text.
    
    Output Structure Example:
    
    {
      "comparisonTable": {
        "deviceId1": { "feature1": 1, "feature2": 0, ... },
        "deviceId2": { "feature1": 0, "feature2": 1, ... },
        ...
      },
      "rating": [
        { "id": "deviceId1", "score": 9 },
        { "id": "deviceId2", "score": 7 }
      ]
    }
    `,
                        },
                    ],
                },
            ],
        });
        console.log(response.text);
        let aiResponse = response.text ?? "";
        // تنظيف وتحويل الاستجابة من Gemini إلى JSON صالح
        let parsedAIResponse;
        const cleanedText = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        parsedAIResponse = JSON.parse(cleanedText);
        return res.status(200).json({
            message: "Products compared successfully!",
            success: true,
            data: comparisonData,
            aiResponse: parsedAIResponse,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.compareProducts = compareProducts;
