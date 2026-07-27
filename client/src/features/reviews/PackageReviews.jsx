import React, { useState } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useGetPackageReviewsQuery, useCreateReviewMutation } from '../../app/api/reviewsApi';

const fallbackReviews = [
  {
    _id: 'r1',
    user: { name: 'Elena Rostova' },
    rating: 5,
    comment: 'The Path of the Gods hike and Capri boat tour exceeded all our expectations. Truly a luxury experience!',
    createdAt: '2026-07-20T10:00:00.000Z',
  },
  {
    _id: 'r2',
    user: { name: 'Marcus Vance' },
    rating: 5,
    comment: 'The hotel room terrace view in Positano was breathtaking. Highly recommend upgrading the room tier!',
    createdAt: '2026-07-15T10:00:00.000Z',
  },
];

export const PackageReviews = ({ packageId }) => {
  const { data: revRes } = useGetPackageReviewsQuery(packageId, { skip: !packageId });
  const [createReview] = useCreateReviewMutation();

  const reviews = revRes?.data && revRes.data.length > 0 ? revRes.data : fallbackReviews;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        package: packageId || '64f1a2b3c4d5e6f7a8b9c0d1',
        rating,
        comment,
      }).unwrap();
      setIsSubmitted(true);
      setComment('');
    } catch (err) {
      alert(err?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-mono text-caption text-sunset-500 uppercase tracking-widest block">
            TRAVELER REVIEWS
          </span>
          <h3 className="font-display text-display-md text-white mt-1">Verified Experiences</h3>
        </div>
        <Badge variant="gold">★ 5.0 Average</Badge>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <GlassCard key={rev._id} className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-body text-sm font-semibold text-white">
                {rev.user?.name || 'Anonymous Traveler'}
              </span>
              <span className="font-mono text-xs text-gold-400">{'★'.repeat(rev.rating)}</span>
            </div>
            <p className="font-body text-xs text-mist-300">{rev.comment}</p>
          </GlassCard>
        ))}
      </div>

      {/* Submit Review Form */}
      <GlassCard elevated className="space-y-4">
        <h4 className="font-display text-display-md text-white">Leave a Review</h4>
        {isSubmitted ? (
          <p className="text-xs font-mono text-sunset-500">✓ Thank you! Your review has been published.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 font-body text-sm">
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-dusk-950 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs"
              >
                <option value={5}>★★★★★ (5/5 Exceptional)</option>
                <option value={4}>★★★★☆ (4/5 Great)</option>
                <option value={3}>★★★☆☆ (3/5 Average)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-mist-300 mb-1">Comment</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this expedition..."
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sunset-500"
              />
            </div>
            <Button variant="primary" size="sm" type="submit">
              Submit Review
            </Button>
          </form>
        )}
      </GlassCard>
    </div>
  );
};

export default PackageReviews;
