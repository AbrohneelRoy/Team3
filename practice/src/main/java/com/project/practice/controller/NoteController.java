package com.project.practice.controller;

import com.project.practice.model.Note;
import com.project.practice.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {

    @Autowired
    private NoteService noteService;

    // Fetch notes by user ID
    @GetMapping("/{userId}")
    public List<Note> getNotesByUserId(@PathVariable Long userId) {
        return noteService.getAllNotesByUserId(userId);
    }

    @PostMapping
    public Note addNote(@RequestBody Note note) {
        return noteService.saveNote(note);
    }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note note) {
        note.setId(id);
        return noteService.saveNote(note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        noteService.deleteNoteById(id);
    }
}
