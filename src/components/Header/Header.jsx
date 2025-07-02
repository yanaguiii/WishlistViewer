import styles from './Header.module.css';

function Header({ theme, setTheme, wishlists, activeWishlistId, setActiveWishlistId, onAddWishlist }) {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <h1 className={styles.title}>K-Collect</h1>
                <select
                    className={styles.wishlistSelector}
                    value={activeWishlistId || ''}
                    onChange={(e) => setActiveWishlistId(e.target.value)}
                    disabled={wishlists.length === 0}
                >
                    {wishlists.map(w => (
                        <option key={w.id} value={w.id}>{w.artistName}</option>
                    ))}
                </select>
                <button className={styles.actionButton} onClick={onAddWishlist}>Adicionar Wishlist</button>
            </div>
            <div className={styles.rightSection}>
                <button className={styles.themeButton} onClick={toggleTheme}>
                    Mudar para tema {theme === 'light' ? 'Escuro' : 'Claro'}
                </button>
            </div>
        </header>
    );
}
export default Header;