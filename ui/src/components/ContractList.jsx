function ContractBlock({title, contracts}) {
    return (
        <div style={{marginBottom: 12}}>
            <h3>{title}</h3>

            {contracts.length === 0 ? (
                <div>No contracts available</div>
            ) : (
                <ul>
                    {contracts.map((contract) => {
                        const req = contract.requirements?.[0];
                        return (
                            <li key={contract.id} style={{marginBottom: 8}}>
                                <div><strong>{contract.type}</strong> - {contract.status}</div>
                                <div>From: {contract.cityFrom} -> To: {contract.cityTo}</div>
                                <div>Requirement: {req?.itemId} x {req?.qty}</div>
                                <div>Rewards: {contract.rewards?.gold ?? 0} gold / {contract.rewards?.xp ?? 0} XP</div>
                                <div>Deadline: {contract.deadlineDay ?? "N/A"}</div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default function ContractList({state}) {
    const contracts = state.contracts ?? {
        available: [],
        active: [],
        completed: [],
        failed: []
    };

    return (
        <section style={{marginBottom: 16}}>
            <h2>Contracts</h2>
            <ContractBlock title="Available" contracts={contracts.available} />
            <ContractBlock title="Active" contracts={contracts.active} />
            <ContractBlock title="Completed" contracts={contracts.completed} />
            <ContractBlock title="Failed" contracts={contracts.failed} />
        </section>
    );
}
