using contacts_app.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace contacts_app.Data
{
    public class ContactAppDbContext : DbContext
    {
        public ContactAppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Contact> Contacts { get; set; }
    }
}
