import ProductOwnerLayout from "./layout";

function MyApp({ Component, pageProps }) {
  return (
    <ProductOwnerLayout>
      <Component {...pageProps} />
    </ProductOwnerLayout>
  );
}

export default MyApp;