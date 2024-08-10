import nltk
from nltk import sent_tokenize, word_tokenize
from nltk.cluster.util import cosine_distance
import numpy as np
import re
from pprint import pprint

MULTIPLE_WHITESPACE_PATTERN = re.compile(r"\s+", re.UNICODE)

def normalize_whitespace(text):
    return MULTIPLE_WHITESPACE_PATTERN.sub(_replace_whitespace, text)

def _replace_whitespace(match):
    text = match.group()
    return "\n" if "\n" in text or "\r" in text else " "

def is_blank(string):
    return not string or string.isspace()

def get_symmetric_matrix(matrix):
    return matrix + matrix.T - np.diag(matrix.diagonal())

def core_cosine_similarity(vector1, vector2):
    return 1 - cosine_distance(vector1, vector2)

class TextRank4Sentences():
    def __init__(self):
        self.damping = 0.85
        self.min_diff = 1e-5
        self.steps = 100
        self.text_str = None
        self.sentences = None
        self.pr_vector = None

    def _sentence_similarity(self, sent1, sent2, stopwords=None):
        if stopwords is None:
            stopwords = []

        sent1 = [w.lower() for w in sent1]
        sent2 = [w.lower() for w in sent2]

        all_words = list(set(sent1 + sent2))

        vector1 = [0] * len(all_words)
        vector2 = [0] * len(all_words)

        for w in sent1:
            if w not in stopwords:
                vector1[all_words.index(w)] += 1

        for w in sent2:
            if w not in stopwords:
                vector2[all_words.index(w)] += 1

        return core_cosine_similarity(vector1, vector2)

    def _build_similarity_matrix(self, sentences, stopwords=None):
        sm = np.zeros([len(sentences), len(sentences)])

        for idx1 in range(len(sentences)):
            for idx2 in range(len(sentences)):
                if idx1 != idx2:
                    sm[idx1][idx2] = self._sentence_similarity(sentences[idx1], sentences[idx2], stopwords=stopwords)

        sm = get_symmetric_matrix(sm)
        norm = np.sum(sm, axis=0)
        sm_norm = np.divide(sm, norm, where=norm != 0)

        return sm_norm

    def _run_page_rank(self, similarity_matrix):
        pr_vector = np.array([1] * len(similarity_matrix))

        previous_pr = 0
        for epoch in range(self.steps):
            pr_vector = (1 - self.damping) + self.damping * np.matmul(similarity_matrix, pr_vector)
            if abs(previous_pr - sum(pr_vector)) < self.min_diff:
                break
            previous_pr = sum(pr_vector)

        return pr_vector

    def get_top_sentences(self, number=5):
        top_sentences = {}

        if self.pr_vector is not None:
            sorted_pr = np.argsort(self.pr_vector)[::-1]  # Sort in descending order
            
            for i in range(min(number, len(sorted_pr))):
                index = sorted_pr[i]
                print(f"{index} : {self.pr_vector[index]}")
                sent = normalize_whitespace(self.sentences[index])
                top_sentences[sent] = self.pr_vector[index]

        return top_sentences

    def analyze(self, text, stop_words=None):
        self.text_str = text
        self.sentences = sent_tokenize(self.text_str)

        tokenized_sentences = [word_tokenize(sent) for sent in self.sentences]

        similarity_matrix = self._build_similarity_matrix(tokenized_sentences, stop_words)

        self.pr_vector = self._run_page_rank(similarity_matrix)
        print(self.pr_vector)

text_str = '''
the controversial social media influencer Andrew Tate has told the BBC tonight that he has nothing to fear after a court in Romania ruled he and his brother Tristan can be extradited back to the UK. now they face several allegations including rape and human trafficking over a number of years. they categorically reject the claims. while in jail and that has failed and justice has come through tonight for us which is fantastic until my trial but the Romanian judge did not find them innocent. instead she agreed to an extradition request from British police police who are investigating allegations of rape and human trafficking. as I put to Andrew Tate tonight if you may have looked at someone wrong or sped in a car in 2012 they're going to try and put you in jail. for Bedford police are looking into very serious allegations but you must accept. Ser you interrupt me again sir please. so what happens is when you get to a certain level of Fame they go through your entire life forensically and try and destroy you. earlier they had been brought before a judge to hear that they will be sent to the UK but not until after a Romanian court has itself tried them on similar unrelated charges. and if found guilty any prison sentence has been served. both men have denied all name who spoke to the BBC last year and whose words are voiced by an actress. there's enough evidence out there to show that you know these women that he's harm do exist so I I think he needs to just get a bit of a reality check and admit to what he's done can the brothers may be home but can't travel abroad. Andrew Tate once praised what he described as Romania's more lenient approach to sexual assault claims he's now fighting such claims both here and in the UK. Nick beak BBC News book ares.
'''

tr4sh = TextRank4Sentences()
tr4sh.analyze(text_str)
pprint(tr4sh.get_top_sentences(5), width=1, depth=2)