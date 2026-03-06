export default function StateViewer({ state }) {
    return (
        <pre style={{ background: "#111", color: "#eee", padding: 12, borderRadius: 8 }}>
      {JSON.stringify(state, null, 2)}
    </pre>
    );
}
