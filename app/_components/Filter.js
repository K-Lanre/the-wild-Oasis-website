"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

function Filter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const activeFilter = searchParams.get("capacity")

    function handleClick(filter) {
        const params = new URLSearchParams(searchParams)
        params.set("capacity", filter)
        router.push(`${pathname}?${params.toString()}`, {
            scroll: false
        })
    }
    return (
        <div className="border border-primary-800 flex">
            <Button filter="all" activeFilter={activeFilter} handleFilter={handleClick}>All Cabins</Button>
            <Button filter="small" activeFilter={activeFilter} handleFilter={handleClick}>1&mdash;3</Button>
            <Button filter="medium" activeFilter={activeFilter} handleFilter={handleClick}>4&mdash;7</Button>
            <Button filter="large" activeFilter={activeFilter} handleFilter={handleClick}>8&mdash;12</Button>
        </div>
    )
}

function Button({ filter, activeFilter, handleFilter, children }) {
    return (
        <button className={`px-4 py-2 hover:bg-primary-700 ${filter === activeFilter ? "bg-primary-700 text-primary-50" : ""}`} onClick={() => handleFilter(filter)}>
            {children}
        </button>
    )
}

export default Filter
