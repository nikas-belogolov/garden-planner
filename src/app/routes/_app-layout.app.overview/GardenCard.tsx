import { DateTime } from 'luxon';
import { Link } from '@remix-run/react';

function formatDate(date: any, format: string) {
    return DateTime.fromISO(date).toFormat(format)
}

export default function GardenCard({ garden }: any) {

    return (
        <div className="garden card">
            <div className="card-body">
                <h5>{garden.name}</h5>
                { garden.location && <div>
                    <i className="fa-solid fa-location-dot"></i>
                    { garden.location }
                </div> }
                <div className="hstack gap-3">
                    <div>width: { garden.width }</div>
                    <div>height: { garden.height }</div>
                </div>
                <Link to={`/app/layout/${garden._id}`} className="stretched-link"></Link>
            </div>
            <div className="card-footer">
                <small className="text-body-secondary">Last updated: { formatDate(garden.updated_at, "DDD") }</small>
            </div>
        </div>
    )
}