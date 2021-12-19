import React, { useEffect } from 'react';
import ProductItem from '../ProductItem';
import store from '../../utils/store';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';


function ProductList() {

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      }); 
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!store.getState().currentCategory) {
      return store.getState().products;
    }
    

    return store.getState().products.filter(
      (product) => product.category._id === store.getState().currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {store.getState().products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
