import Note from "../model/Notes.js";
import { Op } from "sequelize";

export const createNote = async (req, res) => {
    try {
        const note = await Note.create(req.body);
        const response = {
            message: "Note created successfully",
            data: note
        };
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getNotes = async (req, res) => {
    try {
        const search = req.query.search || ''; 
        
        const notes = await Note.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },  
                    { category: { [Op.like]: `%${search}%` } },  
                    { content: { [Op.like]: `%${search}%` } } 
                ]
            }
        });

        const response = {
            message: `Menampilkan ${notes.length} data yang cocok dengan pencarian.`,
            data: notes,
            total: notes.length
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        const response = {
            message: note ? "Data ditemukan" : "Data tidak ditemukan",
            data: note
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        const response = {
            message: note ? "Data ditemukan" : "Data tidak ditemukan",
            data: note
        };
        await note.update(req.body);
        res.json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        const response = {
            message: note ? "Data ditemukan" : "Data tidak ditemukan",
            data: note
        };
        await note.destroy();
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getNotesByUserId = async (req, res) => {
    try {
        const notes = await Note.findAll({
            where: {
                userId: req.params.userId
            }
        });
        const response = {
            message: `Menampilkan ${notes.length} dari ${notes.length} data Berhasil mendapatkan data Notes.`,
            data: notes,
            total: notes.length
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
