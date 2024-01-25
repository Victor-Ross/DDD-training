import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe('fetch question answers use case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it('should be able to fetch a question answers by question id', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-2') })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-3') })
    );

    const { answers } = await sut.execute({
      page: 1,
      questionId: 'question-1',
    });

    expect(answers).toHaveLength(3);
  });

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-1') })
      );
    }

    const { answers } = await sut.execute({
      page: 2,
      questionId: 'question-1',
    });

    expect(answers).toHaveLength(2);
  });
});
