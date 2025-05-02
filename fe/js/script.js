// Global variables for modal state
let isEditing = false;
let editingNoteId = null;

$(function () {
    getListNotes();
    
    // Show modal for adding new note
    $('#addNotes').click(() => {
        clearForm();
        $('#noteModal').removeClass('hidden');
    });


    ['work', 'personal', 'study'].forEach(category => {
        $(`#${category}`).click(() => {
            $('#searchNotes').val(category === 'work' ? 'Work' : 
                                category === 'personal' ? 'Personal' : 'Study');
            getListNotes();
        });
    });

    // $('#work').click(() => {
    //     $('#searchNotes').val('Work');
    //     getListNotes();
    // });

    // $('#personal').click(() => {
    //     $('#searchNotes').val('Personal');
    //     getListNotes();
    // });

    // $('#study').click(() => {
    //     $('#searchNotes').val('Study');
    //     getListNotes();
    // });

    // $('#allNotes').click(() => {
    //     $('#searchNotes').val('');
    //     getListNotes();
    // });
    
    // Close modal handlers
    $('#closeModal, #cancelNote').click(() => {
        $('#noteModal').addClass('hidden');
        clearForm();
    });

    $('#searchNotes').change(() => {
        getListNotes();
    })
    
    // Form submission handler
});

async function saveNotes() {
    console.log('saveNotes');
    
    const noteData = {
        title: $('#noteTitle').val(),
        category: $('#noteCategory').val(),
        content: $('#noteContent').val(),
        userId : 1
    };
    
    try {
        await $.ajax({
            type: isEditing ? 'PUT' : 'POST',
            url: isEditing ? `${BASE_URL}/api/notes/${editingNoteId}` : `${BASE_URL}/api/notes`,
            contentType: 'application/json',
            data: JSON.stringify(noteData),
            dataType: 'JSON'
        });        
        
        $('#noteModal').addClass('hidden');
        clearForm();
        getListNotes();
    } catch (err) {
        console.error('Error saving note:', err);
        alert('Failed to save note. Please try again.');
    }
}

async function getListNotes() {
    $('#notesContainer').empty();
    const search = $('#searchNotes').val() || '';
    
    try {
        const response = await $.ajax({
            type: 'GET',
            url: `${BASE_URL}/api/notes?search=${search}`,
            dataType: 'JSON',
            cache: false
        });
        
        if (response.total !== 0) {
            $.each(response.data, (i, v) => {
                const str = `
                    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden">
                        <div class="p-5">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-semibold text-lg text-gray-800 mb-2">${v.title}</h3>
                                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${v.category || 'Work'}</span>
                            </div>
                            <p class="text-gray-600 text-sm mb-4 line-clamp-3">${v.content}</p>
                            <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                                <span class="text-xs text-gray-500">${formatDate(v.createdAt)}</span>
                                <div class="flex space-x-2">
                                    <button class="text-gray-400 hover:text-indigo-500" onclick="editNotes(${v.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="text-gray-400 hover:text-red-500" onclick="deleteNotes(${v.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $('#notesContainer').append(str);
            });
        } else {
            $('#notesContainer').append(`
                <div class="col-span-full text-center py-8 text-gray-500">
                    No notes found. Click "New Note" to create one!
                </div>
            `);
        }
    } catch (err) {
        console.error('Error fetching notes:', err);
        $('#notesContainer').append(`
            <div class="col-span-full text-center py-8 text-red-500">
                Error loading notes. Please try again later.
            </div>
        `);
    }
}

async function editNotes(id) {
    try {
        const response = await $.ajax({
            type: 'GET',
            url: `${BASE_URL}/api/notes/${id}`,
            dataType: 'JSON',
            cache: false
        });
        
        const note = response.data;
        isEditing = true;
        editingNoteId = id;
        
        $('#noteTitle').val(note.title);
        $('#noteCategory').val(note.category);
        $('#noteContent').val(note.content);
        
        $('#noteModal').removeClass('hidden');
    } catch (err) {
        console.error('Error fetching note:', err);
        alert('Failed to load note for editing. Please try again.');
    }
}

async function deleteNotes(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        try {
            await $.ajax({
                type: 'DELETE',
                url: `${BASE_URL}/api/notes/${id}`,
                dataType: 'JSON'
            });
            
            getListNotes();
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note. Please try again.');
        }
    }
}

function clearForm() {
    $('#noteForm')[0].reset();
    $('#noteCategory').val('Work');
    isEditing = false;
    editingNoteId = null;
}


function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}