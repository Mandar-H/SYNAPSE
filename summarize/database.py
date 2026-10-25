"""
Database module for MongoDB integration
Handles connection and database operations
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from datetime import datetime
from typing import Optional, Dict, Any
import os

# MongoDB connection string
MONGODB_URL = os.getenv("MONGODB_URL")

# Ensure connection string doesn't have trailing slash issues
if MONGODB_URL and MONGODB_URL.endswith('/'):
    MONGODB_URL = MONGODB_URL.rstrip('/')

# Database and collection names
DB_NAME = "synapse_db"
DOCUMENTS_COLLECTION = "documents"
USERS_COLLECTION = "users"


class Database:
    """MongoDB database connection and operations"""
    
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
    
    async def connect(self):
        """Connect to MongoDB"""
        if not MONGODB_URL:
            print("MONGODB_URL is not set - continuing without database")
            return False

        try:
            self.client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
            # Test connection
            await self.client.admin.command('ping')
            self.db = self.client[DB_NAME]
            print(f"✓ Connected to MongoDB: {DB_NAME}")
            return True
        except Exception as e:
            print(f"⚠ Warning: MongoDB connection failed: {e}")
            print("⚠ Continuing without database - documents will not be saved")
            print("⚠ Check your internet connection and MongoDB Atlas settings")
            # Don't raise - allow app to continue without DB
            return False
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")
    
    async def save_document(
        self,
        filename: str,
        file_id: str,
        text: str,
        summary: Optional[str] = None,
        user_email: Optional[str] = None,
        file_type: Optional[str] = None,
        file_size: Optional[int] = None
    ) -> str:
        """
        Save document to database
        
        Returns:
            Document ID (MongoDB _id) or "no_db" if database not available
        """
        if self.db is None:
            print("⚠ Database not connected - skipping save")
            return "no_db"
        
        try:
            document = {
                "file_id": file_id,
                "filename": filename,
                "text": text,
                "text_length": len(text),
                "summary": summary,
                "summary_length": len(summary) if summary else 0,
                "user_email": user_email,
                "file_type": file_type,
                "file_size": file_size,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await self.db[DOCUMENTS_COLLECTION].insert_one(document)
            print(f"✓ Document saved to database: {filename}")
            return str(result.inserted_id)
        except Exception as e:
            print(f"⚠ Error saving to database: {e}")
            return "no_db"
    
    async def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Get document by MongoDB _id"""
        from bson import ObjectId
        try:
            doc = await self.db[DOCUMENTS_COLLECTION].find_one({"_id": ObjectId(document_id)})
            if doc:
                doc["_id"] = str(doc["_id"])
            return doc
        except Exception as e:
            print(f"Error getting document: {e}")
            return None
    
    async def get_document_by_file_id(self, file_id: str) -> Optional[Dict[str, Any]]:
        """Get document by file_id"""
        doc = await self.db[DOCUMENTS_COLLECTION].find_one({"file_id": file_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc
    
    async def update_document_summary(
        self,
        file_id: str,
        summary: str
    ) -> bool:
        """Update document summary"""
        result = await self.db[DOCUMENTS_COLLECTION].update_one(
            {"file_id": file_id},
            {
                "$set": {
                    "summary": summary,
                    "summary_length": len(summary),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def get_user_documents(
        self,
        user_email: str,
        limit: int = 50
    ) -> list:
        """Get all documents for a user"""
        cursor = self.db[DOCUMENTS_COLLECTION].find(
            {"user_email": user_email}
        ).sort("created_at", -1).limit(limit)
        
        documents = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            documents.append(doc)
        
        return documents
    
    async def delete_document(self, document_id: str) -> bool:
        """Delete document by MongoDB _id"""
        from bson import ObjectId
        try:
            result = await self.db[DOCUMENTS_COLLECTION].delete_one({"_id": ObjectId(document_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting document: {e}")
            return False


# Global database instance
db = Database()
