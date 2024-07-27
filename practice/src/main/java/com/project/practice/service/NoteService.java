package com.project.practice.service;

import com.project.practice.model.Note;
import com.project.practice.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    /**
     * Fetches notes based on the user ID.
     * 
     * @param userId The ID of the user.
     * @return A list of notes associated with the given user ID.
     */
    public List<Note> getAllNotesByUserId(Long userId) {
        return noteRepository.findByUserId(userId);
    }

    /**
     * Retrieves a note by its ID.
     * 
     * @param id The ID of the note.
     * @return An Optional containing the note if found, otherwise empty.
     */
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    /**
     * Saves a note to the database. If the note has an ID, it will update the existing note.
     * 
     * @param note The note to save.
     * @return The saved note.
     */
    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }

    /**
     * Deletes a note by its ID.
     * 
     * @param id The ID of the note to delete.
     */
    public void deleteNoteById(Long id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Note with ID " + id + " does not exist.");
        }
    }
}
