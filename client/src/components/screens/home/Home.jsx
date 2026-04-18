import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

const Home = () => {
  useDocumentTitle("Home");

  return (
    <main>
      <h1>Home</h1>
    </main>
  );
};

export default Home;
