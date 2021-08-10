import { environment } from 'src/environments/environment'

export const baseUrl = environment.production ? 'https://api.shoppingcart.com' : 'http://localhost:3000'
export const productsUrl = baseUrl + '/producto'
export const cartUrl = baseUrl + '/carrito'
export const wishlistUrl = baseUrl + '/wishlist'
