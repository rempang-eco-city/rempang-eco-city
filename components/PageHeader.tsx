"use client";

export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-white border-b border-border-color pt-10 pb-6 md:pt-12 md:pb-8">
      <div className="container-content">
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary-blue mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-text-secondary">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
