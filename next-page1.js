document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('valores-container');

  // Recuperar os itens selecionados do localStorage
  const selectedItems = JSON.parse(localStorage.getItem('selectedItems'));

  if (selectedItems) {
    selectedItems.forEach(item => {
      // Criar o card com base nos itens selecionados
      const card = document.createElement('article');
      card.className = 'card';
      card.id = `card-${item.id}`;

      const content = document.createElement('div');
      content.className = 'content';

      // Criar a imagem para o card
      const img = document.createElement('img');
      img.className = 'card-image';
      img.src = item.image || 'default-image-url.jpg'; // Se não houver imagem, usamos a padrão
      img.alt = item.title;

      const title = document.createElement('h2');
      title.className = 'title';
      title.textContent = item.title;

      const description = document.createElement('p');
      description.className = 'copy';
      description.textContent = item.description;

      // Monta o card com imagem, título e descrição
      content.appendChild(img); 
      content.appendChild(title);
      content.appendChild(description);
      card.appendChild(content);
      container.appendChild(card);
    });
  } else {
    console.log('Nenhum item selecionado.');
  }
});
