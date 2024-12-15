import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { highlight } from 'sugar-high';
import React from 'react';

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target='_blank' rel='noopener noreferrer' {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className='rounded-lg' {...props} />;
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components = {
  // h1: createHeading(1),
  // h2: createHeading(2),
  // h3: createHeading(3),
  // h4: createHeading(4),
  // h5: createHeading(5),
  // h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
  p: (props) => <p className='text-gray-900 dark:text-gray-100' {...props} />,
  h1: (props) => (
    <h1
      className='list-disc  text-gray-900 dark:text-gray-100 list-inside'
      {...props}
    />
  ),
  h2: (props) => (
    <h1
      className='list-disc  text-gray-900 dark:text-gray-100 list-inside'
      {...props}
    />
  ),
  h3: (props) => (
    <h1
      className='list-disc  text-gray-900 dark:text-gray-100 list-inside'
      {...props}
    />
  ),
  h4: (props) => (
    <h1
      className='list-disc  text-gray-900 dark:text-gray-100 list-inside'
      {...props}
    />
  ),
  h5: (props) => (
    <h1
      className='list-disc  text-gray-900 dark:text-gray-100 list-inside'
      {...props}
    />
  ),
  h6: (props) => (
    <h1
      className='list-disc  text-gray-900 dark:text-gray-100 list-inside'
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className='list-disc  text-gray-900 dark:text-gray-100 list-inside'
      {...props}
    />
  ),
  strong: (props) => (
    <strong
      className='list-disc  text-gray-900 dark:text-gray-100'
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className='list-decimal text-gray-900 dark:text-gray-100 list-inside'
      {...props}
    />
  ),
};

export function CustomMDX(props) {
  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <MDXRemote
        {...props}
        components={{ ...components, ...(props.components || {}) }}
      />
    </div>
  );
}
