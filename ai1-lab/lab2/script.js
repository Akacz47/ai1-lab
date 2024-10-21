class Todo {
    constructor() {
        this.tasks = []; // Tablica zadań
		this.loadTasks();
    }
	
	// Rysowanie listy
    draw() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Czyści istniejące elementy listy
        this.tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
				<input type="checkbox" onchange="todo.toggleComplete(${index})" ${task.completed ? 'checked' : ''}>
				
				<div class="task-container" onclick="todo.startEdit(${index}, this)">
				<span class="task-text"> ${task.text} </span>
				<span class="date"> ${task.date}</span> 
				</div>
				
				<button class="delete-btn" onclick="todo.removeTask(${index})">Usuń</button>
			`;
            taskList.appendChild(li);
        });
    }
	
	// Dodawanie nowego zadania
    addTask(taskText, taskDate) {
        const task = {
            text: taskText,
            date: taskDate,
            completed: false,
        };
        this.tasks.push(task);
		this.saveTasks();
        this.draw(); // Rysuje listę po dodaniu nowego zadania
    }
	
	// Usuwanie zadania
    removeTask(index) {
        if (index > -1 && index < this.tasks.length) {
            this.tasks.splice(index, 1); // Usuwa zadanie z tablicy
			this.saveTasks();
            this.draw(); // Rysuje listę po usunięciu zadania
        }
    }
	
	toggleComplete(index) {
        this.tasks[index].completed = !this.tasks[index].completed; // Zmienia status zadania
		this.saveTasks();
        this.draw(); // Rysuje listę po zmianie statusu
    }
	
	// Edytowanie zadania
    editTask(index, newText, newDate) {
        if (index > -1 && index < this.tasks.length) {
            this.tasks[index].text = newText; // Aktualizuje tekst zadania
            this.tasks[index].date = newDate; // Aktualizuje datę zadania
			this.saveTasks();
            this.draw(); // Rysuje listę po edycji zadania
        }
    }
	
	// Przygotowanie do edycji
    startEdit(index, taskElement) {
        const taskTextSpan = taskElement.querySelector('.task-text');
		//const taskDateSpan = this.tasks[index].date;
		const taskDateSpan = taskElement.querySelector('.date');
		
		if(taskTextSpan == null && taskDateSpan == null){
			return;
		}
		
		console.log('Znaleziony element taskTextSpan:', taskTextSpan);
		console.log('Znaleziony element taskDateSpan:', taskDateSpan);
	
        // Tworzenie pól edycyjnych
        const inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.value = taskTextSpan.textContent.trim();
		//inputText.value = this.tasks[index].text;
		
		const inputDate = document.createElement('input');
        inputDate.type = 'date';
		inputDate.value = this.tasks[index].date;
		//inputDate.value = taskDateSpan.textContent;
		//console.log(inputDate.value);
		//console.log(taskDateSpan.textContent);
		
        /// Wyczyszczenie starego taskElement i dodanie nowych pól
		taskElement.innerHTML = '';
		taskElement.appendChild(inputText);
		taskElement.appendChild(inputDate);
		
        // Zdarzenie utraty fokusu na polu tekstowym
        const saveChanges = () => {
            const newText = inputText.value.trim();
            const newDate = inputDate.value;
            this.editTask(index, newText, newDate); // Aktualizuje zadanie
        };

        //inputText.addEventListener('blur', saveChanges);
        //inputDate.addEventListener('blur', saveChanges);
		
		// Zdarzenie `focusout` - wywołuje zapis, gdy oba pola stracą fokus
        taskElement.addEventListener('focusout', (event) => {
            // Sprawdzenie, czy żadne z pól nie ma już fokusu
            if (!taskElement.contains(event.relatedTarget)) {
                saveChanges(); // Zapisujemy zmiany dopiero, gdy oba pola stracą fokus
            }
        });

        // Ustawia fokus na polu tekstowym
        inputText.focus();
    }
	
	filterList() {
		const searchInput = document.getElementById('searchInput').value.toLowerCase();
		const taskList = document.getElementById('taskList');
		const tasks = taskList.getElementsByTagName('li');
		
		for (let i = 0; i < tasks.length; i++) {
			const taskTextElement = tasks[i].getElementsByClassName('task-text')[0];
			const originalText = taskTextElement.textContent;
			const taskText = originalText.toLowerCase();
			
			// Sprawdzenie, czy fraza wyszukiwania jest w zadaniu
			if (taskText.includes(searchInput)) {
				tasks[i].style.display = ''; // Pokaż zadanie
				this.highlightText(taskTextElement, searchInput);
			}
			else if(searchInput.length >= 2){
				tasks[i].style.display = 'none'; // Ukryj zadanie
				this.highlightText(taskTextElement, searchInput);
			}
			else if(searchInput.length == 0){
				tasks[i].style.display = '';
				taskTextElement.innerHTML = taskTextElement.textContent;
			}
		}
	}

	highlightText(element, searchTerm) {
		const regex = new RegExp(`(${searchTerm})`, 'gi'); // Tworzy wyrażenie regularne dla wyszukiwanego tekstu
		const originalText = element.textContent;
		
		// Zastępuje tekst wyszukiwany z tagiem span
		element.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
	}

	saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks)); // Konwertuje tablicę na JSON
    }
	
	loadTasks() {
        const savedTasks = localStorage.getItem('tasks'); // Pobiera zadania z Local Storage
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks); // Konwertuje JSON na tablicę
        }
        this.draw(); // Rysuje listę po załadowaniu zadań
    }
}

const todo = new Todo();

// Dodawanie zadania przy kliknięciu przycisku
document.getElementById('addTaskBtn').addEventListener('click', () => {
    const taskText = document.getElementById('newTaskInput').value;
    const taskDate = document.getElementById('newDateInput').value;

    if (taskText) {
        todo.addTask(taskText, taskDate); // Dodaje nowe zadanie
        document.getElementById('newTaskInput').value = ''; // Czyści pole tekstowe
        document.getElementById('newDateInput').value = ''; // Czyści pole daty
    } else {
        alert('Wypełnij pole z treścią zadania'); // Komunikat o błędzie
    }
});