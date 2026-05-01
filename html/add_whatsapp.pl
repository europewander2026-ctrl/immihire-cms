#!/usr/bin/perl
use strict;
use warnings;

my $html_snippet = <<'HTML';
<!-- WhatsApp Button -->
<a href="https://wa.me/971585281090" target="_blank" class="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group" aria-label="Chat on WhatsApp">
    <i class="fa-brands fa-whatsapp text-3xl"></i>
    <span class="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap ml-0 group-hover:ml-3 font-bold">Chat with us</span>
</a>
HTML

# Get all HTML files in the current directory
my @files = glob("*.html");

foreach my $file (@files) {
    open my $fh, '<', $file or die "Cannot open $file: $!";
    my $content = do { local $/; <$fh> };
    close $fh;

    # Skip if already has the link
    if ($content =~ /wa\.me\/971585281090/) {
        print "Skipping $file (already present)\n";
        next;
    }

    # Inject before </body>
    if ($content =~ s/<\/body>/$html_snippet\n<\/body>/) {
        open my $out, '>', $file or die "Cannot write to $file: $!";
        print $out $content;
        close $out;
        print "Updated $file\n";
    } else {
        print "Warning: Could not find </body> tag in $file\n";
    }
}
