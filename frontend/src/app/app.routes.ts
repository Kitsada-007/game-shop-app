import { Routes } from '@angular/router';
import { Home } from './pages/user/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Profile } from './pages/user/profile/profile';
import { Collection } from './pages/user/collection/collection';
import { DetailGame } from './pages/user/detail-game/detail-game';

import { ShoppingCart } from './pages/user/shopping-cart/shopping-cart';
import { AddMonny } from './pages/user/history/add-monny/add-monny';
import { BuyGram } from './pages/user/history/buy-gram/buy-gram';
import { HomeAdmin } from './pages/admin/home-admin/home-admin';
import { ProfileAdmin } from './pages/admin/profile-admin/profile-admin';
import { Wallet } from './pages/user/wallet/wallet';
import { Transaction } from './pages/admin/home-admin/transaction/transaction';
import { Typegame } from './pages/user/typegame/typegame';
import { HistoryView } from './pages/admin/home-admin/history-view/history-view';
import { Promo } from './pages/admin/home-admin/promo/promo';


export const routes: Routes = [
  // User-path
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },

  { path: 'collection', component: Collection },
  { path: 'detail-game/:id', component: DetailGame },
  { path: 'wallet', component: Wallet },
  { path: 'shopping', component: ShoppingCart },
  {
    path: 'history',
    children: [
      { path: 'add-monney', component: AddMonny },
      { path: 'buy-gram', component: BuyGram },
    ],
  },
  // admin-path
  {
    path: 'home-admin', component: HomeAdmin,
  },
  { path: 'transaction', component: Transaction },
  { path: 'profile-admin', component: ProfileAdmin },
  { path: 'typegame/:genre', component: Typegame },
  { path: 'historys/:id', component: HistoryView },
  { path: 'promo', component: Promo }
];
