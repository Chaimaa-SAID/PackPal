import { createStore, applyMiddleware, combineReducers } from 'redux'; // Import combineReducers correctly
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from "@redux-devtools/extension";
import ProductsReducer from './reducers/Products';
import CategoriesReducer from './reducers/Categories'; 
import OrdersReducer from './reducers/Orders';
import loginReducer from "./reducers/Login";
import userReducer from "./reducers/User";
import CustomersReducer from "./reducers/Customer";

const rootReducer = combineReducers({
  Products: ProductsReducer,
  Categories: CategoriesReducer,
  Orders: OrdersReducer, 
  Login: loginReducer,
  Users: userReducer,
  Customers: CustomersReducer,
});

const store = createStore(rootReducer, 
  composeWithDevTools(applyMiddleware(thunk))
); 

export default store;