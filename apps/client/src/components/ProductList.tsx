import type { ProductsType } from "@repo/types";
import ProductCard from "./ProductCard";
import { Link } from "lucide-react";
import Categories from "./Categories";
import Filter from "./Filter";

// TEMPORARY

const fetchData = async ({
    category, 
    sort, 
    search, 
    params}
    : {
        category?: string, 
        sort?:string, 
        search?:string, 
        params: "homepage" | "products"
}) => {
    let url = `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?category=${category || ""}`
    
    if(sort) {
        url += `&sort=${sort}`
    }
    if(search) {
        url += `&search=${search}`
    }
    if(params === "homepage") {
        url += `&limit=8`
    }
    const res = await fetch(url)
    const data: ProductsType = await res.json()
    console.log('productList:', data)
    return data;
}

const ProductList = async ({
    category, 
    sort, 
    search, 
    params}
    : {
        category: string, 
        sort?:string, 
        search?:string, 
        params: "homepage" | "products"
}) =>  {
    const products = await fetchData({category: category == 'all' ? '' : category, sort, search, params});
    return (
        <div className="w-full">
            <Categories />
            {params === "products" && <Filter />}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div> 
            <Link href={category ? `/products?category=${category}` : "/products"}>
                View all products
            </Link>           
        </div>
    )
}

export default ProductList