// Define constantes para a manipulação do DOM e outras variáveis globais
const maxSelection = 10; // Limite de cards que podem ser arrastados
const localStorageKey = 'natureImages';
const selectedCards = new Set(); // Armazena os IDs dos cards selecionados

// Inicializa o DOM ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  const valoresContainer = document.getElementById('valores-container');
  const dropZone = document.getElementById('selecionados-container');
  const nextButton = document.getElementById('next-button');
  const counter = document.getElementById('counter');

  // Função para buscar imagens da API ou do cache
  const fetchImages = async () => {
    const cachedImages = JSON.parse(localStorage.getItem(localStorageKey));
    if (cachedImages && cachedImages.length > 0) {
      return cachedImages;
    }
  
    const accessKey = 'ruS2fqkIl5kwe87zDt04HN_blL0SoIA5JJ4d5E-4tvE'; // Substitua pela sua chave da API
    const width = 2448; 
    const height = 3264; 
    const apiUrl = `https://api.unsplash.com/photos/random?query=nature&client_id=${accessKey}&count=10&w=${width}&h=${height}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const imageUrls = data.map(img => img.urls.regular);
  
      // Carregar o arquivo de valores.json
      const valores = await fetch('valores.json').then(response => response.json());
      console.log(valores)
      // Combinar valores com as imagens
      const valoresComImagens = valores.map((valor, index) => ({
        ...valor,
        image: imageUrls[index % imageUrls.length],
        image2: imageUrls[index % imageUrls.length], // Garantir que a imagem será associada ao valor
        description: valor.description
      }));
  
      // Armazenar as informações completas no localStorage
      //localStorage.setItem('selectedValues', JSON.stringify(valoresComImagens));
      console.log(valoresComImagens);
  
      return imageUrls;
    } catch (error) {
      console.error('Erro ao buscar imagens da API:', error);
      return [];
    }
  };


  // Função para criar os cards
templateCards = (valores, images) => {
    valores.forEach((valor, index) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.id = `card-${valor.id}`;
      card.draggable = true; // Habilita o arrastar
      card.setAttribute('data-id', valor.id);
      card.style.backgroundImage = `url(${images[index % images.length]})`;

      const content = document.createElement('div');
      content.className = 'content';

      const title = document.createElement('h2');
      title.className = 'title';
      title.textContent = valor.title;

      const description = document.createElement('p');
      description.className = 'copy';
      description.textContent = valor.description;

      content.appendChild(title);
      content.appendChild(description);
      card.appendChild(content);
      valoresContainer.appendChild(card);

      // Adiciona eventos para drag-and-drop
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
    });
  };

  // Eventos de drag-and-drop
  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
  };

  const handleDragEnd = (event) => {
    event.target.classList.remove('dragging');
  };

  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);

    if (selectedCards.size < maxSelection && !selectedCards.has(cardId)) {
      dropZone.appendChild(card);
      selectedCards.add(cardId);
      updateCounter();

      if (selectedCards.size === maxSelection) {
        showNextButton();
      }
    } else {
      alert('Você atingiu o limite de seleção ou este card já foi selecionado!');
    }
  });

  dropZone.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card && selectedCards.has(card.id)) {
      selectedCards.delete(card.id);
      valoresContainer.appendChild(card);
      updateCounter();
      hideNextButton();
    }
  });

  // Funções auxiliares
  const updateCounter = () => {
    counter.textContent = `Selecionados: ${selectedCards.size}/${maxSelection}`;
    counter.style.display = 'block';
  };

  const showNextButton = () => {
    nextButton.style.display = 'block';
  };

  const hideNextButton = () => {
    if (selectedCards.size < maxSelection) {
      nextButton.style.display = 'none';
    }
  };

  nextButton.addEventListener('click', () => {
    const selectedValues = Array.from(selectedCards).map(id => {
      const card = document.getElementById(id);
      
      // Obtém a URL sem o "url()" envolvente
      const imageUrl = card.style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
      
      // Recupera a descrição do card
      const description = card.querySelector('.copy').textContent;
  
      return {
        id,
        title: card.querySelector('.title').textContent,
        image: imageUrl, // Salvando a URL da imagem
        description // Incluindo a descrição
      };
    });
  
    // Armazenar os valores selecionados, incluindo descrição, no localStorage
    localStorage.setItem('selectedValues', JSON.stringify(selectedValues));
  
    // Redireciona para a próxima página
    window.location.href = 'next-page.html';
  });
  

  // Inicialização do conteúdo da página
  const images = await fetchImages();
  fetch('valores.json')
    .then(response => response.json())
    .then(data => templateCards(data, images))
    .catch(error => console.error('Erro ao carregar valores:', error));
});
