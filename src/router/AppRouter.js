import React,{useState} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CartContext from '../context/CartContext';
import useLocalStorage from '../hooks/useLocalStorage';
import App from '../components/App';
import Products from '../components/Products';
import ShoppingCart from '../components/ShoppingCart';
import MenuItems from '../components/MenuItems';
import Checkout from '../components/Checkout';
import PaymentSuccessPage from '../components/PaymentSuccessPage';
import PageNotFound from '../components/PageNotFound';
import { LOADING_MESSAGE } from '../utils/constants';
import Loader from '../components/Loader';

const AppRouter = () => {
  const [items, setItems] = useLocalStorage('cartItems', []);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <BrowserRouter>
      <Loader show={isLoading}>{LOADING_MESSAGE}</Loader>
      <CartContext.Provider value={{ items, setItems,setIsLoading }}>
        <Switch>
          <Route component={App} path="/" exact={true} />
          <Route component={Products} path="/products" />
          <Route component={ShoppingCart} path="/cart" />
          <Route component={MenuItems} path="/menu" />
          <Route component={Checkout} path="/checkout" />
          <Route component={PaymentSuccessPage} path="/success" />
          <Route component={PageNotFound} />
        </Switch>
      </CartContext.Provider>
    </BrowserRouter>
  );
};

export default AppRouter;