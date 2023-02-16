/* eslint-disable react-hooks/exhaustive-deps */
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect,useRef,useContext } from 'react';
import CartContext from '../context/CartContext';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getAllProducts } from '../actions/productsActions';
import { getToppings } from '../actions/toppingsActions';
import { getQueryStringValue } from '../utils/functions';
import { addToCartAction } from '../actions/cartActions';
import { changeProductCountAction } from '../actions/cartActions';
import Product from './Product';
import Layout from './Layout';
import ToppingsModal from './ToppingsModal';
import { toast } from 'react-toastify';

const Products = ({
  dispatch,
  products,
  toppings,
  cart,
  isLoading,
  isFailed,
  location,
}) => {
  const [category, setCategory] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(false);
  const [checkedState, setCheckedState] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedToppingsCount, setSelectedToppingsCount] = useState(0);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const { search = '' } = location;
  const [cartProducts, setCartProducts] = useState([]);
  const { items, setItems } = useContext(CartContext);
  const emptyArrayRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cartProducts.length === 0 || items.length !== cartProducts.length) {
      setCartProducts(items);
      dispatch(addToCartAction(items));
    }
  }, []);

  useEffect(() => {
    if (search) {
      const category = getQueryStringValue(search, 'search');
      setCategory(category);
      dispatch(getAllProducts(category));
    }
  }, []);

  useEffect(() => {
    setFilteredResults(products);
  }, [products]);

  useEffect(() => {
    setCartProducts(cart);
  }, [cart]);

  useEffect(() => {
    dispatch(getToppings());
  }, []);

  useEffect(() => {
    emptyArrayRef.current = new Array(toppings.length).fill(false);
    setCheckedState(emptyArrayRef.current);
  }, [toppings.length]);

  useEffect(() => {
    if (selectedProduct.price >= 0 && selectedToppingsCount > 0) {
      setTotalOrderPrice(selectedProduct.price + selectedProduct.productPrice);
    } else if (selectedProduct.price >= 0) {
      setTotalOrderPrice(selectedProduct.price);
    }
  }, [selectedProduct.price, selectedToppingsCount]);

  useEffect(() => {
    if (cart.length > 0) {
      setItems(cart);
    }
}, [setItems,cart]);

  const toggleModal = (id, title, image, price) => {
    //alert('Toggle modal')
    if (id) {
      setSelectedProduct({
        id,
        title,
        image,
        price,
        productPrice: price
      });
      
      setModalTitle(title);
      console.log('Selected product',selectedProduct);
    }
    setShowModal(!showModal);
  };

  const addProduct = () => {
   // alert('Add Product')
    const { id, title, image } = selectedProduct;
  
    let isAlreadyAdded = false;
    const isPizzaCategory = category === 'pizza';
    console.log(cartProducts)
    let cart = cartProducts.map((cartProduct) => {
      if (cartProduct.id === id) {
        isAlreadyAdded = true;
        cartProduct.quantity = productQuantity;
        cartProduct.price = totalOrderPrice;
        cartProduct.category = category;
        if (isPizzaCategory) {
          cartProduct.toppings = checkedState
            .map((isChecked, index) =>
              isChecked ? toppings[index].name : null
            )
            .filter(Boolean);
        }
        return cartProduct;
      } else {
        return cartProduct;
      }
    });
  
    if (!isAlreadyAdded) {
      cart = [
        ...cart,
        {
          id,
          title,
          image,
          toppings: isPizzaCategory
            ? checkedState
                .map((isChecked, index) =>
                  isChecked ? toppings[index].name : null
                )
                .filter(Boolean)
            : null,
          quantity: productQuantity,
          price: totalOrderPrice,
          category
        }
      ];
  
      if (isPizzaCategory) {
        // remove toppings from non-pizza category products
        cart = cart.map((item) => {
          if (
            (item.category === 'pizza' && item.toppings.length > 0) ||
            item.category === 'pizza'
          ) {
            console.log("myitem",item)
            return item;
          } else {
            delete item.toppings;
            return item;
          }
        });
      }
    }
    console.log("mycart",cart)
    setCartProducts(cart);
    resetState();
    setShowModal(!showModal);
    dispatch(addToCartAction(cart));
    toast.success('Product added successfully.');
  };

  const addNormalProduct = (id, title, image, price) => {
    //alert('add normal product')
    const cart = [
      ...cartProducts,
      {
        id,
        title,
        image,
        quantity: productQuantity,
        price,
        category
      }
    ];
    setCartProducts(cart);
    dispatch(addToCartAction(cart));
    toast.success('Product added successfully.');
  };

  const handleToppingsSelection = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
    setSelectedToppingsCount(
      updatedCheckedState.filter((value) => value === true).length
    );
  
    const totalPrice = updatedCheckedState.reduce(
      (sum, currentState, index) => {
        if (currentState === true) {
          return sum + toppings[index].price;
        }
        return sum;
      },
      0
    );
  
    setSelectedProduct({
      ...selectedProduct,
      price: totalPrice
    });
  };

  const handleQuantityChange = (operation) => {
    if (operation === 'increment') {
      setProductQuantity(productQuantity + 1);
    } else if (operation === 'decrement') {
      setProductQuantity(productQuantity > 1 ? productQuantity - 1 : 1);
    }
  };

  const changeProductCount = (id, operation) => {
    dispatch(changeProductCountAction(id, operation === 'increment'));
  };

  const handleFilterChange = () => {
    const isVeg = !selectedFilter;
    setSelectedFilter(isVeg);
    const result = isVeg
      ? products.filter((product) => product.is_veg === isVeg)
      : products;
    setFilteredResults(result);
  };

  const resetState = () => {
    setSelectedProduct({});
    setCheckedState(emptyArrayRef.current);
    setProductQuantity(1);
    setSelectedToppingsCount(0);
    setTotalOrderPrice(0);
  };

  return (
    <Layout cartCount={items.length}>
      {search ? (
        <div className="products">
          <div className="main-title">{category}</div>
          {category === 'pizza' && (
            <div className="filters">
              <input
                type="checkbox"
                id="filter"
                className="custom-checkbox"
                name="filter"
                value="veg-only"
                checked={selectedFilter}
                onChange={handleFilterChange}
              />{' '}
              <label htmlFor="filter">Veg only</label>
            </div>
          )}
          {isFailed && (
            <p className="error-msg">
              Error while loading products. Please try again.
            </p>
          )}
          {isLoading ? (
            <p className="loading">Loading...</p>
          ) : (
            filteredResults.map(
              ({
                _id,
                name,
                description,
                price,
                quantity,
                rating,
                image,
                is_veg
              }) => (
                <Product
                  key={_id}
                  id={_id}
                  title={name}
                  description={description}
                  price={price}
                  quantity={quantity}
                  rating={rating}
                  image={image?.url}
                  isVeg={is_veg}
                  category={category}
                  toggleModal={toggleModal}
                  addNormalProduct={addNormalProduct}
                  cart={cart}
                  changeProductCount={changeProductCount}
                />
              )
            )
          )}
        </div>
      ) : (
        <Redirect to="/" />
      )}
      <ToppingsModal
        showModal={showModal}
        toggleModal={toggleModal}
        modalTitle={modalTitle}
        toppings={toppings}
        checkedState={checkedState}
        productQuantity={productQuantity}
        selectedToppingsCount={selectedToppingsCount}
        totalOrderPrice={totalOrderPrice}
        handleQuantityChange={handleQuantityChange}
        handleToppingsSelection={handleToppingsSelection}
        addProduct={addProduct}
      />
    </Layout>
  );
};

const mapStateToProps = (state) => {
  const {
    products: { data, isLoading, isFailed },
    toppings,
    cart
  } = state;

  return {
    products: data,
    toppings: toppings.data,
    cart : cart.data,
    isLoading,
    isFailed
  };
};

export default connect(mapStateToProps)(Products);