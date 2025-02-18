document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('valores-container');
  const dropZone = document.getElementById('selecionados-container');
  const maxSelection = 5; // Número máximo de cards que podem ser selecionados na segunda página
  let selectedCards = []; // Armazena os IDs dos cards selecionados

  // Recuperar os valores armazenados com imagens e descrições
  const selectedItems = JSON.parse(localStorage.getItem('selectedValues'));
  console.log(selectedItems);

  // Função para criar um card
  const createCard = (item) => {
    const card = document.createElement('article');
    card.draggable = true; // Habilita o arrastar
    card.className = 'card';
    card.id = `card-${item.id}`;
    card.style.backgroundImage = `url(${item.image})`;

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('h2');
    title.className = 'title';
    title.textContent = item.title;

    const description = document.createElement('p');
    description.className = 'copy';
    description.textContent = item.description;

    content.appendChild(title);
    content.appendChild(description);
    card.appendChild(content);

    // Adiciona eventos para drag-and-drop
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
  };

  // Função para manipular o início do arrastar
  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
  };

  // Função para manipular o término do arrastar
  const handleDragEnd = (event) => {
    event.target.classList.remove('dragging');
  };

  // Preencher a área inicial com os itens armazenados
  if (selectedItems) {
    selectedItems.forEach((item) => {
      const card = createCard(item);
      container.appendChild(card);
    });
  } else {
    console.log('Nenhum item selecionado.');
  }

  // Configurar a zona de drop
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault(); // Necessário para permitir o drop
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);

    if (selectedCards.length < maxSelection && !selectedCards.includes(cardId)) {
      dropZone.appendChild(card);
      selectedCards.push(cardId);

      // Atualiza o contador
      updateCounter();
    } else if (selectedCards.includes(cardId)) {
      alert('Este card já foi selecionado!');
    } else {
      alert(`Você só pode selecionar até ${maxSelection} cards.`);
    }
  });

  // Remover cards ao clicar neles na área selecionada
  dropZone.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card && selectedCards.includes(card.id)) {
      selectedCards = selectedCards.filter((id) => id !== card.id);
      container.appendChild(card);
      updateCounter();
    }
  });

  // Atualizar o contador
  const counter = document.getElementById('counter');
  const updateCounter = () => {
    counter.textContent = `Selecionados: ${selectedCards.length}/${maxSelection}`;
    counter.style.display = 'block';
  };
  
});
