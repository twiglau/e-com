import type { ProductsType } from "@repo/types";
import ProductCard from "./ProductCard";
import { Link } from "lucide-react";
import Categories from "./Categories";
import Filter from "./Filter";

// TEMPORARY
const products: ProductsType = [];

const ProductList = ({category, params}: {category: string, params: "homepage" | "products"}) => {
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