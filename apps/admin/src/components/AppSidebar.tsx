import Link from "next/link";
import Image from "next/image";
import { 
    Sidebar, 
    SidebarContent, 
    SidebarGroup, 
    SidebarGroupAction, 
    SidebarGroupContent, 
    SidebarGroupLabel, 
    SidebarHeader, 
    SidebarMenu, 
    SidebarMenuBadge, 
    SidebarMenuButton, 
    SidebarMenuItem, 
    SidebarSeparator 
} from "./ui/sidebar";
import { Calendar, Home, Inbox, Plus, Search, Settings, Shirt } from "lucide-react";
import { Sheet, SheetTrigger } from "./ui/sheet";
import AddProduct from "./AddProduct";
import AddCategory from "./AddCategory";


const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];


const AppSidebar = () => {
    return (
        <Sidebar collapsible="icon">
            {/* 头部 */}
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={'/'}>
                                <Image
                                    src={'/logo.svg'}
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                />
                                <span className="font-semibold">Admin</span>
                                </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {/* 分割线 */}
            <SidebarSeparator />
            {/* 菜单 */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span className="font-semibold">{item.title}</span>
                                            </Link>
                                    </SidebarMenuButton>
                                    {item.title === "Inbox" && (
                                        <SidebarMenuBadge>10</SidebarMenuBadge>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Products</SidebarGroupLabel>
                    <SidebarGroupAction>
                        <Plus />
                        <span className="sr-only">Add Product</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={'/products'}>
                                        <Shirt />
                                        <span className="font-semibold">See All Products</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <SidebarMenuButton asChild>
                                                <Link href="#">
                                                    <Plus />
                                                    Add Product
                                                </Link>
                                            </SidebarMenuButton>
                                        </SheetTrigger>
                                        <AddProduct />
                                    </Sheet>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <SidebarMenuButton asChild>
                                                <Link href="#">
                                                    <Plus />
                                                    Add Category
                                                </Link>
                                            </SidebarMenuButton>
                                        </SheetTrigger>
                                        <AddCategory />
                                    </Sheet>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;