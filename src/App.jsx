// src/App.jsx

import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Wishlist from './components/Wishlist/Wishlist';
import AddWishlistModal from './components/AddWishlistModal/AddWishlistModal';
import EditCollectionModal from './components/EditCollectionModal/EditCollectionModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import './App.css';

function App() {
  // --- ESTADO DA APLICAÇÃO ---

  // Carrega as wishlists salvas no navegador ou começa com uma lista vazia.
  const [wishlists, setWishlists] = useState(() => {
    const savedData = localStorage.getItem('k-collect-data');
    return savedData ? JSON.parse(savedData) : [];
  });

  // Carrega a última wishlist ativa ou seleciona a primeira da lista.
  const [activeWishlistId, setActiveWishlistId] = useState(() => {
    const savedId = localStorage.getItem('k-collect-activeId');
    const data = localStorage.getItem('k-collect-data');
    const parsedData = data ? JSON.parse(data) : [];
    return savedId || (parsedData.length > 0 ? parsedData[0].id : null);
  });

  // Estado para controlar o tema (claro/escuro).
  const [theme, setTheme] = useState('light');

  const [isAddWishlistModalOpen, setIsAddWishlistModalOpen] = useState(false);

  // <<< 2. NOVOS ESTADOS PARA CONTROLAR A EDIÇÃO E EXCLUSÃO >>>
  // Guarda o objeto da coleção que está sendo editada
  const [editingCollection, setEditingCollection] = useState(null);
  // Guarda o objeto da coleção que está sendo excluída
  const [deletingCollection, setDeletingCollection] = useState(null);

  // --- EFEITOS (useEffect) ---

  // Salva os dados no localStorage sempre que a lista de wishlists ou a wishlist ativa mudam.
  useEffect(() => {
    localStorage.setItem('k-collect-data', JSON.stringify(wishlists));
    if (activeWishlistId) {
      localStorage.setItem('k-collect-activeId', activeWishlistId);
    }
  }, [wishlists, activeWishlistId]);

  // Aplica o tema na página sempre que o estado 'theme' muda.
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);


  // --- FUNÇÕES DE MANIPULAÇÃO ---

  // <<< FUNÇÃO ATUALIZADA >>>
  // Esta função agora recebe os dados que vêm do MODAL. Ela não usa mais o prompt().
  const handleAddWishlist = (artistName, photoFile) => {
    let photoUrl = ''; // Começa com uma URL vazia.

    // Se o usuário selecionou um arquivo de foto no modal...
    if (photoFile) {
      // ...nós criamos uma URL temporária para ele.
      photoUrl = URL.createObjectURL(photoFile);
    }

    // Cria o novo objeto da wishlist com os dados recebidos.
    const newWishlist = {
      id: `wish_${Date.now()}`,
      artistName: artistName,
      artistPhotoUrl: photoUrl,
      collections: []
    };

    // Atualiza o estado principal com a nova wishlist.
    const updatedWishlists = [...wishlists, newWishlist];
    setWishlists(updatedWishlists);

    // Define a wishlist recém-criada como a ativa.
    setActiveWishlistId(newWishlist.id);

    // Fecha o modal.
    setIsAddWishlistModalOpen(false); // <-- CORRETO
  };

  // Ela precisa do ID da wishlist para saber onde adicionar a nova coleção
  const handleAddCollection = (wishlistId) => {
    const collectionName = prompt("Digite o nome da coleção (ex: FEARLESS):");
    if (collectionName && collectionName.trim() !== '') {
      const newCollection = {
        id: `coll_${Date.now()}`,
        name: collectionName.trim(),
        cards: []
      };

      setWishlists(prev => prev.map(w => {
        if (w.id === wishlistId) {
          // Adiciona a nova coleção ao array de coleções da wishlist correta
          return { ...w, collections: [...w.collections, newCollection] };
        }
        return w;
      }));
    }
  };

  // <<< NOVA FUNÇÃO PARA DELETAR UMA COLEÇÃO >>>
  const handleDeleteCollection = (wishlistId, collectionId) => {
    setWishlists(prev => prev.map(w => {
      if (w.id === wishlistId) {
        const updatedCollections = w.collections.filter(c => c.id !== collectionId);
        return { ...w, collections: updatedCollections };
      }
      return w;
    }));
    setDeletingCollection(null); // Fecha o modal após deletar
  };


  // <<< NOVA FUNÇÃO PARA EDITAR O NOME DE UMA COLEÇÃO >>>
  const handleEditCollectionName = (wishlistId, collectionId, newName) => {
    setWishlists(prev => prev.map(w => {
      if (w.id === wishlistId) {
        const updatedCollections = w.collections.map(c => {
          if (c.id === collectionId) {
            // Encontramos a coleção e retornamos um novo objeto com o nome atualizado
            return { ...c, name: newName };
          }
          return c;
        });
        return { ...w, collections: updatedCollections };
      }
      return w;
    }));
    setEditingCollection(null); // Fecha o modal após editar
  };


  // <<< NOVA FUNÇÃO PARA ADICIONAR UM CARD >>>
  const handleAddCard = (wishlistId, collectionId, imageFile) => {
    const imageUrl = URL.createObjectURL(imageFile);
    const newCard = {
      id: `card_${Date.now()}`,
      imageUrl: imageUrl,
      owned: false
    };

    setWishlists(prev => prev.map(w => {
      if (w.id === wishlistId) {
        const updatedCollections = w.collections.map(c => {
          if (c.id === collectionId) {
            return { ...c, cards: [...c.cards, newCard] };
          }
          return c;
        });
        return { ...w, collections: updatedCollections };
      }
      return w;
    }));
  };

  // <<< NOVA FUNÇÃO PARA MARCAR/DESMARCAR UM CARD >>>
  const handleToggleCardOwned = (wishlistId, collectionId, cardId) => {
    setWishlists(prev => prev.map(w => {
      if (w.id === wishlistId) {
        const updatedCollections = w.collections.map(c => {
          if (c.id === collectionId) {
            const updatedCards = c.cards.map(card =>
                card.id === cardId ? { ...card, owned: !card.owned } : card
            );
            return { ...c, cards: updatedCards };
          }
          return c;
        });
        return { ...w, collections: updatedCollections };
      }
      return w;
    }));
  };


  // Encontra a wishlist atualmente ativa para ser exibida.
  const activeWishlist = wishlists.find(w => w.id === activeWishlistId);


  // --- RENDERIZAÇÃO DO COMPONENTE ---

  return (
      <>
        <Header
            theme={theme}
            setTheme={setTheme}
            wishlists={wishlists}
            activeWishlistId={activeWishlistId}
            setActiveWishlistId={setActiveWishlistId}

            // <<< MUDANÇA IMPORTANTE >>>
            // Agora, o botão no Header não chama mais a lógica de prompt.
            // Ele apenas "liga o interruptor" para abrir o modal.
            onAddWishlist={() => setIsAddWishlistModalOpen(true)}
        />
        <main>
          {activeWishlist ? (
              <Wishlist
                  key={activeWishlist.id}
                  wishlist={activeWishlist}
                  onOpenEditModal={(wishlistId, collectionId) => {
                    const collection = wishlists.find(w => w.id === wishlistId)?.collections.find(c => c.id === collectionId);
                    if(collection) setEditingCollection({wishlistId, ...collection});
                  }}
                  onOpenDeleteModal={(wishlistId, collectionId) => {
                    const collection = wishlists.find(w => w.id === wishlistId)?.collections.find(c => c.id === collectionId);
                    if(collection) setDeletingCollection({wishlistId, ...collection});
                  }}

                  onAddCollection={handleAddCollection}
                  onAddCard={handleAddCard}
                  onToggleCardOwned={handleToggleCardOwned}
              />
          ) : (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Bem-vindo ao K-Collect!</h2>
                <p>Crie sua primeira wishlist clicando no botão "Adicionar Wishlist" no topo.</p>
              </div>
          )}
        </main>
        {/* <<< 3. RENDERIZAÇÃO CONDICIONAL DE TODOS OS MODAIS >>> */}
        {isAddWishlistModalOpen && (
            <AddWishlistModal
                onClose={() => setIsAddWishlistModalOpen(false)}
                onSave={handleAddWishlist}
            />
        )}
        {editingCollection && (
            <EditCollectionModal
                collection={editingCollection}
                onClose={() => setEditingCollection(null)}
                onSave={handleEditCollectionName}
            />
        )}
        {deletingCollection && (
            <DeleteConfirmationModal
                collection={deletingCollection}
                onClose={() => setDeletingCollection(null)}
                onConfirm={handleDeleteCollection}
            />
        )}
      </>
  );
}

export default App;