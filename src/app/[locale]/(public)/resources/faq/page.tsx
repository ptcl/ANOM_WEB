'use client'

import Container from '@/components/commun/container'
import React, { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SearchBar from '@/components/ui/search-bar';
import CategoryFilter from '@/components/ui/category-filter';
import { useStickyOnNavbar } from '@/hooks/useStickyOnNavbar';
import { showNavbarSearch, hideNavbarSearch } from '@/lib/navbar-search-events';
import { useEffect } from 'react';
import ImageLueur from '@/components/commun/ImageLueur';

interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null);

  const { isSticky, elementRef } = useStickyOnNavbar({ navbarHeight: 64 });

  useEffect(() => {
    if (isSticky) {
      showNavbarSearch({
        isVisible: true,
        searchQuery,
        onSearchChange: setSearchQuery,
        placeholder: t('resources.faq.searchPlaceholder')
      });
    } else {
      hideNavbarSearch();
    }
  }, [isSticky, searchQuery, t]);

  const allCategories = useMemo(() => {
    const questions: FAQQuestion[] = t.raw('resources.faq.questions') || [];
    const categories = ['all', ...new Set(questions.map(q => q.category))];
    return categories;
  }, [t]);

  const filteredQuestions = useMemo(() => {
    const questions: FAQQuestion[] = t.raw('resources.faq.questions') || [];

    let filtered = questions;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((q: FAQQuestion) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [t, searchQuery, selectedCategory]);

  const groupedQuestions = useMemo(() => {
    const groups: { [key: string]: FAQQuestion[] } = {};

    filteredQuestions.forEach(question => {
      if (!groups[question.category]) {
        groups[question.category] = [];
      }
      groups[question.category].push(question);
    });

    return groups;
  }, [filteredQuestions]);

  const getCategoryLabel = (category: string) => {
    return t(`resources.faq.categories.${category}`, { defaultValue: category });
  };

  useEffect(() => {
    if (searchQuery.trim() && filteredQuestions.length > 0) {
      const timeoutId = setTimeout(() => {
        const firstQuestion = filteredQuestions[0];
        const questionElement = document.getElementById(`question-${firstQuestion.id}`);
        if (questionElement) {
          questionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          setHighlightedQuestionId(firstQuestion.id);
          setTimeout(() => setHighlightedQuestionId(null), 3000);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setHighlightedQuestionId(null);
    }
  }, [filteredQuestions, searchQuery]);

  useEffect(() => {
    if (selectedCategory !== 'all' && filteredQuestions.length > 0 && !searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        const firstQuestionOfCategory = filteredQuestions[0];
        const questionElement = document.getElementById(`question-${firstQuestionOfCategory.id}`);
        if (questionElement) {
          questionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          setHighlightedQuestionId(firstQuestionOfCategory.id);
          setTimeout(() => setHighlightedQuestionId(null), 3000);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedCategory, filteredQuestions, searchQuery]);

  return (
    <>
      <Container height='fit-title' textAlign='center'>
        <ImageLueur />
        <section className='flex flex-col justify-center items-center text-center w-full mb-8'>
          <h1 className='leading-8 md:leading-26 gradient__vex font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text={t('resources.faq.title')}>
            {t('resources.faq.title')}
          </h1>
          <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto mb-8'>
            {t('resources.faq.subtitle')}
          </p>
        </section>
        <div className='w-full flex flex-col gap-4 px-4 max-w-2xl mx-auto justify-center items-center'>
          <div ref={elementRef} className="w-full transition-all duration-500 ease-out">
            <div className={`transition-all duration-500 ease-out ${isSticky ? 'opacity-0 transform scale-95 translate-y-2 pointer-events-none' : 'opacity-100 transform scale-100 translate-y-0'}`}>
              <SearchBar placeholder={t('resources.faq.searchPlaceholder')} value={searchQuery} onChange={setSearchQuery} className="w-full z-25 relative" />
            </div>
          </div>

          <CategoryFilter categories={allCategories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} getCategoryLabel={getCategoryLabel} className="z-10 relative w-full" />
        </div>

      </Container>
      <Container height='fit' pb textAlign='left'>
        <section className='w-full max-w-4xl mx-auto z-10 relative'>
          {filteredQuestions.length > 0 ? (
            <div className="space-y-8">
              {searchQuery && filteredQuestions.length > 0 && (
                <div className="text-center mb-6 z-10 relative">
                  <p className="text-[var(--light-dark-3)] text-sm">
                    {filteredQuestions.length} {t('commun.searchBar.found.1')} {filteredQuestions.length > 1 ? 's' : ''} {t('commun.searchBar.found.2')} {filteredQuestions.length > 1 ? 's' : ''}
                    <span className="ml-2 text-blue-400">{t('commun.searchBar.scrollTo')}</span>
                  </p>
                </div>
              )}

              {Object.entries(groupedQuestions).map(([category, questions]) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white text-left border-b border-white/20 pb-2">
                    {getCategoryLabel(category)}
                  </h2>

                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {questions.map((question: FAQQuestion, index: number) => (
                      <AccordionItem key={question.id || `${category}-${index}`} value={question.id || `${category}-item-${index}`} id={`question-${question.id}`} className={`border rounded-lg backdrop-blur-sm px-6 py-2 transition-all duration-1000 ${highlightedQuestionId === question.id ? 'border-blue-400/60 bg-blue-500/20 shadow-lg shadow-blue-500/20' : 'border-white/10 bg-white/5'}`}>
                        <AccordionTrigger className="text-left hover:no-underline cursor-pointer">
                          <div className="flex flex-col items-start">
                            <span className="text-white font-medium">
                              {question.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-[var(--light-dark-3)] pt-4">
                          <div dangerouslySetInnerHTML={{ __html: question.answer }} className="prose prose-invert max-w-none [&_mark]:bg-blue-500/20 [&_mark]:text-blue-300 [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded [&_mark]:font-medium" />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12 z-10 relative">
              <p className="text-[var(--light-dark-3)] text-lg">
                {t('commun.searchBar.noResults')} {searchQuery}
              </p>
              <button onClick={() => setSearchQuery('')} className="mt-4 text-sm text-blue-400 hover:text-blue-300 underline">
                {t('commun.searchBar.clear')}
              </button>
            </div>
          ) : (
            <div className="text-center py-12 z-10 relative">
              <p className="text-[var(--light-dark-3)] text-lg">
                {t('commun.searchBar.loading')}
              </p>
            </div>
          )}
        </section>

        {t('resources.faq.needHelp.title') && (
          <section className='w-full max-w-4xl mx-auto mt-12 z-10 relative '>
            <div className="border border-white/10 rounded-lg bg-black/20 backdrop-blur-sm p-6 text-center">
              <h3 className="text-white font-semibold text-lg mb-2">
                {t('resources.faq.needHelp.title')}
              </h3>
              <p className="text-[var(--light-dark-3)] text-sm">
                {t('resources.faq.needHelp.subtitle')}
              </p>
            </div>
          </section>
        )}
      </Container>
    </>
  )
}
