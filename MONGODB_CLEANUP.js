// Run this in MongoDB to fix old documents with localhost URLs
// Connect to MongoDB and run in the database console:

db.documents.updateMany(
  { filePath: { $regex: "^http://localhost" } },
  { $set: { filePath: "", cloudinaryPublicId: null, status: "failed" } }
);

// This will mark old localhost-based documents as failed
// New uploads will use Cloudinary URLs

// Check how many documents have issues:
db.documents.countDocuments({ filePath: { $regex: "^http://localhost" } });

// View all documents to see their paths:
db.documents.find({}, { title: 1, filePath: 1, userId: 1, status: 1 }).pretty();
