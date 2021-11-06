import { Repository, EntityRepository } from 'typeorm'
import { Like } from './like.entity'

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {

}