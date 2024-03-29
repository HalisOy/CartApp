import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private selectedUser!:User
  private cartList:Cart[]=[]
  public products:Product[]=[]
  constructor(){ 
  }

  getSelectedUser():User|undefined{
    return this.selectedUser;
  }
  setSelectedUser(user:User){
    this.selectedUser=user;
    if(this.getUserCart()==undefined){
      this.cartList.push({userId:user.id,id:this.cartList.length+1,items:[]})
    }

    Swal.fire({
      position: "top-end",
      title: 'Selected User',
      text: user.fullName+' is selected for shop',
      showConfirmButton:false,
      timer:1500
    })
  }
  getUserCart():Cart|undefined{
    return this.cartList.find(cart=>cart.userId==this.selectedUser.id)
  }
  addProductInCart(product:Product){
    let cart=this.getUserCart();
    if(cart==undefined){
      Swal.fire({
        position: "top-end",
        title: 'Uups',
        text: 'Please select user.',
        icon:'error',
        showConfirmButton:false,
        timer:1500
      })
      return;
    }
    this.addProduct(product.id);
    Swal.fire({
      position: "top-end",
      title: 'Added product',
      text: product.name+' added in cart',
      showConfirmButton:false,
      timer:1500
    })
    // this.notifierService.notify('Added product',product.name+' added in cart');
  }

  addProduct(productId:number){
    let cart = this.getUserCart()
    if(cart==undefined) return
    let cartItem=cart.items.find(item=>item.productId==productId);
    if(cartItem==undefined){
      cartItem={
        cartId:cart.id,
        productId:productId,
        count:0
      };
      cart.items.push(cartItem)
    }
    cartItem.count++;
  }

  minusProduct(productId:number){
    let cart = this.getUserCart()
    if(cart==undefined) return
    let cartItem=cart.items.find(item=>item.productId==productId);
    cartItem!.count--;
    if(cartItem?.count==0){
      let deleteProductIndex = this.cartList.findIndex((product) => product.id == cartItem?.productId);
      this.cartList.splice(deleteProductIndex,1);
    }
  }

  getProduct(id:number){
    return this.products.find(product=>product.id == id)
  }
}
