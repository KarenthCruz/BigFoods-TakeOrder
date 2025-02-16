import React, { useState, useEffect } from "react";
import { useModal } from "../hooks/useModal.js";
import { AddProductModal } from "../components/addProductModal.jsx";
import { EditProductModal } from "../components/editProductModal.jsx";
import {
    getProductList,
    postNewProduct,
    getProductById,
    patchProduct,
    eraseProduct,
    obtainImgURL
} from "../utils/petitions.js";
import { ProductComponent } from "../components/productComponent.jsx";
import { Header } from "../components/header";


function AdminView() {
    //Estados de modal, producto, editar y recargar los productos
    const [isOpenAddProductModal, openAddProductModal, closeAddProductModal] = useModal('');
    const [isOpenEditProductModal, openEditProductModal, closeEditProductModal] = useModal('');
    const [products, setProducts] = useState([]);
    const [productToEditModal, setProductToEditModal] = useState({ id: '', name:'', price:'', type:'', urlImage:''});
    const [reloadProducts, setReloadProducts] = useState(false);
    const [nameProduct, setNameProduct] = useState('')
    const [priceProduct, setPriceProduct] = useState('')
    const [typeMenu, setTypeMenu] = useState('')
    const [imgProduct, setImgProduct] = useState('')

    // Manejadores de los eventos
    function nameProductHandler(event) {
        setNameProduct(event.target.value)
    }

    function priceProductHandler(event) {
        setPriceProduct(event.target.value)
    }

    function typeMenuHandler(event) {
        setTypeMenu(event.target.value)
    }

    // Consumiendo la petición de imágen para tomar la URL
    async function changeImgURL(event, setImgProduct) {
        const uploadedImg = await event.target.files[0]
        const fr = new FileReader()
        fr.readAsDataURL(uploadedImg)
        fr.onload = () => setImgProduct(fr.result)
        return uploadedImg
    }
    const imgProdctHandler = async (event) => {
        const urlUpload = await changeImgURL(event, setImgProduct)
        console.log('urlUpload', urlUpload)
        const urlImage = await obtainImgURL(urlUpload)
        console.log('urlUpload', urlImage)
        setImgProduct(
            urlImage
        )
    }

    useEffect(() => {
     // petición de la lista de productos
        getProductList()
            .then((response) => {
                console.log(response)
                setProducts(response.data)
            })
            .catch((error) => console.log(error))
    }, [reloadProducts])

    // función para crear productos
    function onSubmitCreateFormHandler(event, nameTyped, priceTyped, typeTyped, imageLoaded) {
        event.preventDefault();
        const priceNumber = parseInt(priceTyped);
        console.log('nameTyped, priceNumber, typeTyped, imageLoaded', nameTyped, priceNumber, typeTyped, imageLoaded)
        postNewProduct(nameTyped, priceNumber, typeTyped, imageLoaded).then(() => {
            closeAddProductModal()
            setReloadProducts(!reloadProducts);
        });
    };

    // Función para editar los productos
    function onSubmitEditFormHandler(event, nameTyped, priceTyped, typeTyped, imageLoaded, idProduct) {
        event.preventDefault();
        const priceNumber = parseInt(priceTyped);
        patchProduct(nameTyped, priceNumber, typeTyped, imageLoaded, idProduct).then(() => {
            closeEditProductModal();
            setReloadProducts(!reloadProducts);
        });
    };
    
    // Usando la petición para traer los productos por su id
    const handleEdit = (id) => {
        console.log('id', id)
        getProductById(id).then((response) => {
            console.log('response', response.data)
            setProductToEditModal(response.data)
            openEditProductModal(true)
        })
    }
    // Eliminando los productos y recargando la lista
    const handleDelete = (id) => {
        eraseProduct(id).then(() => setReloadProducts(!reloadProducts))
    }

    return ( // Maqueta componente Admin view
        <main className="adminView">
            <Header>
                <nav className="navMenu">
                    <ul className="navAMenu">
                        <li><a className="navLink" href="/admin-products">Productos</a></li>
                        <li><a className="navLink" href="/admin-usuarios">Usuarios</a></li>
                        <li><a className="navLink" href="/">Salir</a></li>
                    </ul>
                </nav>
            </Header>

            <section className="producSect">
                {/* // Lista de productos */}
                <section className="productsList">
                    <h1 className="titleListProduct">Lista de Productos</h1>
                    {products.map((product, index) => (
                        <ProductComponent
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            key={product.id + index}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            type={product.type}
                            image={product.image}
                        />
                    ))}
                </section>
                 {/* // Modal para editar productos */}
                {productToEditModal && (<section className="AdminContBtn">
                    <EditProductModal
                        isOpen={isOpenEditProductModal}
                        closeModal={closeEditProductModal}
                        onSubmit={onSubmitEditFormHandler}
                        product={productToEditModal}
                        setProduct={setProductToEditModal}
                    >
                    </EditProductModal>
                </section>)}
                <section className="AdminContBtn">
                    {/* // Modal para agregar productos */}
                    <AddProductModal
                        isOpen={isOpenAddProductModal}
                        closeModal={closeAddProductModal}
                        onSubmit={onSubmitCreateFormHandler}
                    >
                    </AddProductModal>
                </section>
                <button onClick={openAddProductModal} className="addProductBtn">
                    Agregar Producto
                </button>
                
                {/* Formulario para agregar productos para vista de escritorio */}
                <section className="addProdForm">
                    <section className="addProModal">
                        <h2 className="titleAddProduct">
                            Crear Producto
                        </h2>

                        <form className="addProductForm" onSubmit={(event) => onSubmitCreateFormHandler(event, nameProduct, priceProduct, typeMenu, imgProduct)} >
                            <input
                                className="addProductInput"
                                type='text'
                                placeholder="Nombre de producto"
                                name="nameProduct"
                                onChange={nameProductHandler}
                            />

                            <input
                                className="addProductInput"
                                type='text'
                                placeholder="Precio del Producto"
                                name="priceProduct"
                                onChange={priceProductHandler}
                            />

                            <input
                                className="addProductInput"
                                type='text'
                                placeholder="Tipo de Menú"
                                name="typeMenu"
                                onChange={typeMenuHandler}
                            />
                            <label className="addProductLabel">
                                + Agregar Imagen
                                <input
                                    type='file'
                                    placeholder="Imagen del producto"
                                    name="imgProduct"
                                    onChange={imgProdctHandler}
                                    className="addProductImage"
                                />
                            </label>
                            <button type="submit" className="addProdModalBtn">
                                Agregar Producto
                            </button>
                            <button className="cancelAddProdBtn">
                                Cancelar
                            </button>
                        </form>
                    </section>
                </section>

            </section>

        </main>
    );

}

export { AdminView }
