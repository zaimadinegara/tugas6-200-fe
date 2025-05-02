import express from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import { 
    createNote, 
    getNotes, 
    getNote, 
    updateNote, 
    deleteNote
} from "../controllers/NotesController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();



router.post("/notes", createNote);           
router.get("/notes", getNotes);              
router.get("/notes/:id", getNote);           
router.put("/notes/:id", updateNote);        
router.delete("/notes/:id", deleteNote);     
    

router.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'view', 'index.html'));
  });

export default router;