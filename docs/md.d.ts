declare module '*.md' {
  interface Item {
    id: string;
    title: string;
    description: string;
    code: string;
    Component: any;
  }
  const list: Item[];
  export default list;
}
