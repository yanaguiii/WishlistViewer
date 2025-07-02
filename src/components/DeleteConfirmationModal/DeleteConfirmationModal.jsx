import styles from '../AddWishlistModal/AddWishlistModal.module.css'; // Reutilizando os estilos!

function DeleteConfirmationModal({ collection, onClose, onConfirm }) {

    const handleConfirm = () => {
        // Chama a função onConfirm (que é a handleDeleteCollection do App)
        onConfirm(collection.wishlistId, collection.id);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar Exclusão</h2>
                <p>
                    Tem certeza que deseja excluir a coleção <strong>"{collection.name}"</strong>?
                    <br />
                    Todos os cards dentro dela serão perdidos permanentemente.
                </p>
                <div className={styles.formActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>
                        Cancelar
                    </button>
                    {/* Adicione um estilo extra para o botão de deletar se quiser */}
                    <button type="button" className={styles.saveButton} style={{backgroundColor: '#e53e3e'}} onClick={handleConfirm}>
                        Sim, Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;