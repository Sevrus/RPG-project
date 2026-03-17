export default function TabBar({ tabs, activeTab, onChange }) {
    return (
        <nav style={ { display:"flex" , gap: 8, flexWrap:"wrap", marginBottom: 16 }}>
            {tabs.map((tab) => {
                const isActive = tab === activeTab;

                return (
                    <button
                        key={tab}
                        onClick={() => onChange(tab)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid #444",
                            background: isActive ? "#333" : "#111",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        {tab}
                    </button>
                );
            })}
        </nav>
    );
}
