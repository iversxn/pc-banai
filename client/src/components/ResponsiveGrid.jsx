import React from 'react';

export default function ResponsiveGrid({ sidebar, content, summary }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 max-w-screen-xl mx-auto">
      <aside className="md:col-span-1">{sidebar}</aside>
      <main className="md:col-span-2 space-y-4">{content}</main>
      <section className="md:col-span-1 space-y-4">{summary}</section>
    </div>
  );
}
