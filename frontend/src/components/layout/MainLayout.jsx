import Header from "../layout/Header";
import Footer from "../layout/Footer";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />

      <main className="main-layout__content">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;