import React, { useState, useEffect } from "react";
import { getProductList } from "../utils/petitions.js";
import { Header } from "../components/header";
import { OrderProducts } from "../components/orderProducts";
import { OrderMenu } from "../components/orderMenu.jsx";
import '../styles/waiterView.css'


function WaiterView() {
    const [products, setProducts] = useState([]);
    const [shareMenu, setShareMenu] = useState([]);
    useEffect(() => {
        // petición de la lista de productos
        getProductList()
            .then((response) => {
                setProducts(response.data)
            })
            .catch((error) => console.log(error))
    }, [])

    return ( // Maqueta componente Admin view
        <section className="waiterView">
            <Header>
                <nav className="navMenu">
                    <ul className="navAMenu">
                        <li><a className="navLink" href="/waiter-orders">Pedidos</a></li>
                        <li><a className="navLink" href="/waiter-delivered">Entregados</a></li>
                        <li><a className="navLink" href="/">Salir</a></li>
                    </ul>
                </nav>
            </Header>
            {/* Vista del menu */}
            <OrderMenu
                productsMenu={products}
                setShareMenu={setShareMenu}
                shareMenu={shareMenu}
            />
            {/* Vista de la orden de pedido */}
            <OrderProducts
                shareMenu={shareMenu}
            />

        </section>

    )
}

export { WaiterView }